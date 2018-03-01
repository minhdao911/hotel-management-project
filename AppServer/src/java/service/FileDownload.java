/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package service;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.rowset.serial.SerialBlob;
import model.Attachment;
import settings.ProjectSettings;

/**
 *
 * @author minhdao
 */
@WebServlet(urlPatterns = {"/download"})
public class FileDownload extends HttpServlet {


    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        int id = Integer.parseInt(request.getParameter("id"));
        
        Connection conn = null; // connection to the database
        String message = null;  // message will be sent back to client
        
        try {
            // connects to the database
            conn = DriverManager.getConnection(ProjectSettings.DATABASEURL);
 
            Attachment a = getAttachmentFromDB(conn, id);
            
            if(a == null){
               response.getWriter().write("No data found");
               return;
            }
            
            String fileName = a.getFileName();
            System.out.println("File Name: " + fileName);

            // abc.txt => text/plain
            // abc.zip => application/zip
            // abc.pdf => application/pdf
//            String contentType = this.getServletContext().getMimeType(fileName);
//            if (contentType == null) {        
                // set to binary type if MIME mapping not found
            String contentType = "application/octet-stream"; //for downloading instead of generating data
//            }
            System.out.println("Content Type: " + contentType);

            response.setHeader("Content-Type", contentType);

            response.setHeader("Content-Length", String.valueOf(a.getFileData().length));

            response.setHeader("Content-Disposition", "inline; filename=\"" + a.getFileName() + "\"");
            
            Blob fileData = new SerialBlob(a.getFileData());
            InputStream is = fileData.getBinaryStream();
            
            byte[] bytes = new byte[1024];
            int bytesRead;
 
            while ((bytesRead = is.read(bytes)) != -1) {
               // Write image data to Response.
               response.getOutputStream().write(bytes, 0, bytesRead);
           }
           is.close();

        } catch (SQLException ex) {
            message = "ERROR: " + ex.getMessage();
            ex.printStackTrace();
        } finally {
            if (conn != null) {
                // closes the database connection
                try {
                    conn.close();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    }
    
    private Attachment getAttachmentFromDB(Connection conn, int id) throws SQLException {
       String sql = "Select a.id ,a.fileName ,a.fileData from attachment a where a.id = ?";
       PreparedStatement pstm = conn.prepareStatement(sql);
       pstm.setLong(1, id);
       ResultSet rs = pstm.executeQuery();
       if (rs.next()) {
           String fileName = rs.getString("fileName");
           byte[] fileData = rs.getBytes("fileData");
           return new Attachment(id, fileName, fileData);
       }
       return null;
   }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
