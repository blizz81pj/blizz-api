package com.blizz.utility.core.string;

import java.util.ArrayList;
import java.util.List;

public class StringUtility {
    public static List<String> splitStringByComma(String commaSeparatedString) {
        List<String> returnStringList = new ArrayList<>();
        if (null != commaSeparatedString) {
            String[] values = commaSeparatedString.split(",");
            for (String value : values) {
                if (!"".equals(value)) {
                    returnStringList.add(value);
                }
            }
        }

        return returnStringList;
    }

    public static List<Integer> splitStringByCommaToIntegerList(String commaSeparatedString) {
        List<Integer> returnIntegerList = new ArrayList<>();
        if (null != commaSeparatedString) {
            String[] values = commaSeparatedString.split(",");
            for (String value : values) {
                if (!"".equals(value)) {
                    returnIntegerList.add(Integer.valueOf(value));
                }
            }
        }

        return returnIntegerList;
    }
}
