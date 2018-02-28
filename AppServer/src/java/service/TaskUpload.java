/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package service;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.Task;
import model.TaskWithAttachment;
import org.codehaus.jackson.map.ObjectMapper;
import websocket.WebSocketServer;

/**
 *
 * @author minhdao
 */
@WebServlet(urlPatterns = {"/upload"})
@MultipartConfig
public class TaskUpload extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
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
        
        TaskWithAttachment t = new TaskWithAttachment();
        
        String taskName = request.getParameter("name");
        String location = request.getParameter("location");
        String dep = request.getParameter("dep");
        String desc = request.getParameter("desc");
        boolean urgent = "on".equals(request.getParameter("urgent"));
        Timestamp creationTime = new Timestamp(System.currentTimeMillis());
        
        t.setName(taskName);
        t.setDescription(desc);
        t.setLocation(location);
        t.setIsCancelled(false);
        t.setIsUrgent(urgent);
        
        Connection conn = null; // connection to the database
        String message = "";
        int taskId = -1;
        Task newTask = null;

        try {
            // connects to the database
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/taskdb?" +
                                   "user=minhdao&password=secret");
 
            // constructs SQL statement
            String sql = "INSERT INTO task (id, name, location, description, creationTime, "
                    + "department, isCancelled, isUrgent) values (?, ?, ?, ?, ?, ?, ?, ?)";
            PreparedStatement statement = conn.prepareStatement(sql);
            taskId = getMaxAttachmentId(conn, "task")+1;
            statement.setInt(1, taskId);
            statement.setString(2, taskName);
            statement.setString(3, location);
            if(!desc.isEmpty()) statement.setString(4, desc);
            else statement.setString(4, null);
            statement.setTimestamp(5, creationTime);
            statement.setInt(6, Integer.parseInt(dep));
            statement.setBoolean(7, false);
            statement.setBoolean(8, urgent);
            
            System.out.println("taskId: " + taskId);
            
            int row = statement.executeUpdate();
            if (row > 0) {
                message += "new task added";
                newTask = (Task)statement.getResultSet();
                t.setId(taskId);
                t.setCreationTime(creationTime.toString());
            }
            
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
        
        InputStream inputStream = null; // input stream of the upload file
        String fileName = "";
         
        // obtains the upload file part in this multipart request
        Part filePart = request.getPart("file");
        if (filePart != null) {
            // prints out some information for debugging
            System.out.println(filePart.getName());
            System.out.println(filePart.getSize());
            System.out.println(filePart.getContentType());
             
            // obtains input stream of the upload file
            fileName = filePart.getSubmittedFileName();
            inputStream = filePart.getInputStream();
        }
         
          // message will be sent back to client
        int attId = -1;
        
        if(filePart != null){
            try {
                // connects to the database
                conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/taskdb?" +
                                       "user=minhdao&password=secret");

                // constructs SQL statement
                String sql = "INSERT INTO attachment (id, task, fileName, fileData) values (?, ?, ?, ?)";
                PreparedStatement statement = conn.prepareStatement(sql);
                attId = getMaxAttachmentId(conn, "attachment")+1;
                statement.setInt(1, attId);
                statement.setInt(2, taskId);
                statement.setString(3, filePart.getSubmittedFileName());

                if (inputStream != null) {
                    // fetches input stream of the upload file for the blob column
                    statement.setBlob(4, inputStream);
                }

                // sends the statement to the database server
                int row = statement.executeUpdate();
                if (row > 0) {
                    message += ", file uploaded and saved into database";
                    t.setfileId(attId);
                    t.setFileName(fileName);
                    String fileLink = "http://localhost:8080/AppServer/download?id="+attId;
                    t.setFileLink(fileLink);
                }

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
        
        ObjectMapper mapper = new ObjectMapper();
        WebSocketServer.getInstance().onMessage(mapper.writeValueAsString(t));
        
//        response.sendRedirect("http://localhost:8080/AppServer/main.html");
    }
    
    private int getMaxAttachmentId(Connection conn, String table) throws SQLException {
        String sql = "Select max(a.id) from " + table + " a";
        PreparedStatement pstm = conn.prepareStatement(sql);
        ResultSet rs = pstm.executeQuery();
        if (rs.next()) {
            int max = rs.getInt(1);
            return max;
        }
        return 0;
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
