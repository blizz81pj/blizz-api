# PowerShell script to generate SQL INSERT statements from the CSV file

$csvFile = 'ScoreDump.csv'
$roundsOutput = '02_insert_rounds.sql'
$holesOutput = '03_insert_holes.sql'

# Read CSV file
$data = Import-Csv -Path $csvFile

# First pass: Collect unique rounds with original round_id
$uniqueRounds = @{}
$roundsData = @()

foreach ($row in $data) {
    $originalRoundId = $row.'Round Id'.Trim()
    
    if ($originalRoundId -and -not $uniqueRounds.ContainsKey($originalRoundId)) {
        $uniqueRounds[$originalRoundId] = $true
        
        $course = $row.Course.Trim()
        $teeType = $row.'Tee Type'.Trim()
        $handicap = $row.Handicap.Trim()
        $dateInserted = $row.'Date Inserted'.Trim()
        
        # Convert datetime format from ISO to MySQL format
        $dateInsertedFormatted = $dateInserted
        if ($dateInserted) {
            try {
                $dt = [DateTime]::Parse($dateInserted.Replace('Z', ''))
                $dateInsertedFormatted = $dt.ToString('yyyy-MM-dd HH:mm:ss')
            } catch {
                # Keep original if parsing fails
            }
        }
        
        # Store round data with original round_id for sorting
        $roundsData += @{
            OriginalRoundId = $originalRoundId
            Course = $course
            TeeType = $teeType
            Handicap = $handicap
            DateInserted = $dateInsertedFormatted
            DateInsertedRaw = $dateInserted
        }
    }
}

# Sort rounds by date_inserted (earliest first)
$sortedRounds = $roundsData | Sort-Object { 
    if ($_.DateInsertedRaw) {
        try {
            [DateTime]::Parse($_.DateInsertedRaw.Replace('Z', ''))
        } catch {
            [DateTime]::MinValue
        }
    } else {
        [DateTime]::MinValue
    }
}

# Create mapping from original round_id to new sequential round_id
$roundIdMapping = @{}
$newRoundId = 1

foreach ($round in $sortedRounds) {
    $roundIdMapping[$round.OriginalRoundId] = $newRoundId
    $newRoundId++
}

# Generate rounds INSERT statements with new sequential IDs
$roundsInserts = @()
foreach ($round in $sortedRounds) {
    $newRoundId = $roundIdMapping[$round.OriginalRoundId]
    $courseEscaped = $round.Course -replace "'", "''"
    $teeTypeEscaped = $round.TeeType -replace "'", "''"
    $dateInsertedEscaped = $round.DateInserted -replace "'", "''"
    $roundsInserts += "INSERT INTO rounds (round_id, course, tee_type, handicap, date_inserted) VALUES ($newRoundId, '$courseEscaped', '$teeTypeEscaped', $($round.Handicap), '$dateInsertedEscaped');"
}

# Second pass: Generate holes INSERT statements with new round_ids
$holesInserts = @()
foreach ($row in $data) {
    $originalRoundId = $row.'Round Id'.Trim()
    $newRoundId = $roundIdMapping[$originalRoundId]
    
    $holeNumber = $row.'Hole Number'.Trim()
    $par = $row.Par.Trim()
    $strokeIndex = $row.'Stroke Index'.Trim()
    $score = $row.Score.Trim()
    $putts = $row.Putts.Trim()
    $netScore = $row.'Net Score'.Trim()
    $strokesTaken = $row.'Strokes Taken'.Trim()
    $dateInserted = $row.'Date Inserted'.Trim()
    
    # Convert datetime format from ISO to MySQL format
    $dateInsertedFormatted = $dateInserted
    if ($dateInserted) {
        try {
            $dt = [DateTime]::Parse($dateInserted.Replace('Z', ''))
            $dateInsertedFormatted = $dt.ToString('yyyy-MM-dd HH:mm:ss')
        } catch {
            # Keep original if parsing fails
        }
    }
    
    $dateInsertedEscaped = $dateInsertedFormatted -replace "'", "''"
    $holesInserts += "INSERT INTO holes (round_id, hole_number, par, stroke_index, score, putts, net_score, strokes_taken, date_inserted) VALUES ($newRoundId, $holeNumber, $par, $strokeIndex, $score, $putts, $netScore, $strokesTaken, '$dateInsertedEscaped');"
}

# Write rounds INSERT statements
$roundsContent = "-- INSERT statements for rounds table`n"
$roundsContent += "-- Generated from ScoreDump.csv`n`n"
$roundsContent += ($roundsInserts -join "`n")
$roundsContent | Out-File -FilePath $roundsOutput -Encoding UTF8

# Write holes INSERT statements
$holesContent = "-- INSERT statements for holes table`n"
$holesContent += "-- Generated from ScoreDump.csv`n`n"
$holesContent += ($holesInserts -join "`n")
$holesContent | Out-File -FilePath $holesOutput -Encoding UTF8

Write-Host "Generated SQL files:"
Write-Host "  - $roundsOutput ($($roundsInserts.Count) rounds)"
Write-Host "  - $holesOutput ($($holesInserts.Count) holes)"

