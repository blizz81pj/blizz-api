﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace BeerStuff.DataAccess.Entities.BeerNetContext.Models
{
    public partial class BeerGrain
    {
        public uint BeerGrainId { get; set; }
        public string Name { get; set; }
        public string Manufacturer { get; set; }
        public int? Lovibond { get; set; }
        public decimal? PotentialGravity { get; set; }
    }
}