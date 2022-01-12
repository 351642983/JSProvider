package com.hdq.tools;
public class JudgeSystem {
    public static boolean isLinux() {
        return System.getProperty("os.name").toLowerCase().contains("linux");
    }
 
    public static boolean isWindows() {
        return System.getProperty("os.name").toLowerCase().contains("windows");
    }
 
    public static String getSystem() {
        if (isLinux()) {
            return "linux";
        } else if (isWindows()) {
            return "windows";
        } else {
            return "other system";
        }
    }


}


