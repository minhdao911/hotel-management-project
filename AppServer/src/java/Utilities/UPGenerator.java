/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Utilities;

/**
 *
 * @author minhdao
 */
public class UPGenerator {
    
    public String generateUsername(String fn, String ln){
        fn = fn.toLowerCase();
        ln = ln.toLowerCase();
        return fn+ln.charAt(0);
    }
    
    public String generatePassword(String fn, String ln){
        return generateUsername(fn, ln)+"123";
    }
}
