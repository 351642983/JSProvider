package com.hdq.tools;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Random;

public class MD5Salt {
	public  static final String saltcode="runforu";
	/**
     * byte[]字节数组 转换成 十六进制字符串
     * 
     * @param arr 要转换的byte[]字节数组
     *
     * @return  String 返回十六进制字符串
     */
     private static String hex(byte[] arr) {
	     StringBuffer sb = new StringBuffer();
	     for (int i = 0; i < arr.length; ++i) {
		     sb.append(Integer.toHexString((arr[i] & 0xFF) | 0x100).substring(1, 3));
	     }
	     return sb.toString();
     }
 
 
 
 
   /**
     * MD5加密,并把结果由字节数组转换成十六进制字符串
     * 
     * @param str 要加密的内容
     * 
     * @return String 返回加密后的十六进制字符串
     */
     private static String md5Hex(String str) {
       try {
           MessageDigest md = MessageDigest.getInstance("MD5");
           byte[] digest = md.digest(str.getBytes());
           return hex(digest);
       } catch (Exception e) {
           e.printStackTrace();
           System.out.println(e.toString());
           return "";
       }
     }
 
 
 
   /**
     * 生成含有随机盐的密码
     *
     * @param password 要加密的密码
     *
     * @return String 含有随机盐的密码
     */
     public static String getSaltMD5(String password) {
		// 生成一个16位的随机数
        Random random = new Random();
        StringBuilder sBuilder = new StringBuilder(16);
        sBuilder.append(random.nextInt(99999999)).append(random.nextInt(99999999));
        int len = sBuilder.length();
        if (len < 16) {
              for (int i = 0; i < 16 - len; i++) {
                sBuilder.append("0");
            }
        }
        // 生成最终的加密盐
        String salt = sBuilder.toString();
        password = md5Hex(password + salt);
        char[] cs = new char[48];
        for (int i = 0; i < 48; i += 3) {
            cs[i] = password.charAt(i / 3 * 2);
            char c = salt.charAt(i / 3);
            cs[i + 1] = c;
            cs[i + 2] = password.charAt(i / 3 * 2 + 1);
        }
        return String.valueOf(cs);
     }
 
 
 
   /**
     * 验证加盐后是否和原密码一致
     * 
     * @param password 原密码
     * 
     * @param password 加密之后的密码
     * 
     *@return boolean true表示和原密码一致   false表示和原密码不一致
     */
     public static boolean getSaltverifyMD5(String password, String md5str) {
        char[] cs1 = new char[32];
        char[] cs2 = new char[16];
        for (int i = 0; i < 48; i += 3) {
            cs1[i / 3 * 2] = md5str.charAt(i);
            cs1[i / 3 * 2 + 1] = md5str.charAt(i + 2);
            cs2[i / 3] = md5str.charAt(i + 1);
        }
        String Salt = new String(cs2);
        
        return md5Hex(password + Salt).equals(String.valueOf(cs1));
     }
     
     /**
      * 生成含有随机盐的密码
      *
      * @param password 要加密的密码
      *
      * @return String 含有随机盐的密码
      */
      public static String getMySaltMD5(String password,String addsalt) {
         StringBuilder sBuilder = new StringBuilder(16);
         sBuilder.append(addsalt);
         int len = sBuilder.length();
         if (len < 16) {
               for (int i = 0; i < 16 - len; i++) {
                 sBuilder.append("0");
             }
         }
         // 生成最终的加密盐
         String salt = sBuilder.toString();
         password = md5Hex(password + salt);
         char[] cs = new char[48];
         for (int i = 0; i < 48; i += 3) {
             cs[i] = password.charAt(i / 3 * 2);
             char c = salt.charAt(i / 3);
             cs[i + 1] = c;
             cs[i + 2] = password.charAt(i / 3 * 2 + 1);
         }
         return String.valueOf(cs);
      }
      /**
       * 验证加盐后是否和原密码一致
       * 
       * @param password 原密码
       * 
       * @param password 加密之后的密码
       * 
       *@return boolean true表示和原密码一致   false表示和原密码不一致
       */
       public static boolean getMySaltverifyMD5(String password, String md5str,String salt) {
          char[] cs1 = new char[32];
          char[] cs2 = new char[16];
          try {
        	  for (int i = 0; i < 48; i += 3) {
                  cs1[i / 3 * 2] = md5str.charAt(i);
                  cs1[i / 3 * 2 + 1] = md5str.charAt(i + 2);
                  cs2[i / 3] = md5str.charAt(i + 1);
              }
          }
          catch(Exception e) {
        	  return false;
          }
         
          String Salt = new String(cs2);
          StringBuilder sBuilder = new StringBuilder(16);
          sBuilder.append(salt);
          int len = sBuilder.length();
          if (len < 16) {
                for (int i = 0; i < 16 - len; i++) {
                  sBuilder.append("0");
              }
          }
          // 生成最终的加密盐
          salt = sBuilder.toString();
          if(salt.equals(Salt)&&md5Hex(password + Salt).equals(String.valueOf(cs1))) {
        	  return true;
          }
          return false;
       }
   public static String stringToMD5(String plainText) {
        byte[] secretBytes = null;
        try {
            secretBytes = MessageDigest.getInstance("md5").digest(
                    plainText.getBytes());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("没有这个md5算法！");
        }
        String md5code = new BigInteger(1, secretBytes).toString(16);
        for (int i = 0; i < 32 - md5code.length(); i++) {
            md5code = "0" + md5code;
        }
        return md5code;
    }
     
//     public static void main(String args[]) {
//    	 String sentence="select * from ? where id=?";
//    	 System.out.println(stringToMD5(sentence));
//    	 String md5=getMySaltMD5(sentence,saltcode);
//    	 System.out.println("加盐后："+md5);
//    	 System.out.println("{");
//    	 System.out.println("\tsql:\""+sentence+"\",");
//    	 System.out.println("\ttoken:\""+md5+"\",");
//    	 System.out.println("\targs:{}");
//    	 System.out.println("}");
//     }

}

