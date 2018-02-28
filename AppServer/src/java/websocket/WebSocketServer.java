/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package websocket;

import java.io.StringReader;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import model.TaskWithAttachment;

/**
 *
 * @author minhdao
 */

@ApplicationScoped
@ServerEndpoint("/actions/{departmentId}")
public class WebSocketServer {
    
    @Inject
    private SessionHandler sessionHandler;

    @OnOpen
    public void onOpen(Session session) {
        sessionHandler.addSession(session);
    }

    @OnClose
    public void onClose(Session session) {
        sessionHandler.removeSession(session);
    }

    @OnError
    public void onError(Throwable error) {
        Logger.getLogger(WebSocketServer.class.getName()).log(Level.SEVERE, null, error);
    }

    @OnMessage
    public void onMessage(String message) {
        try (JsonReader reader = Json.createReader(new StringReader(message))) {
            JsonObject jsonMessage = reader.readObject();

            if ("cancel".equals(jsonMessage.getString("action"))) {
                int id = (int) jsonMessage.getInt("id");
                sessionHandler.cancelTask(id);
            }else if ("accept".equals(jsonMessage.getString("action"))) {
                int id = (int) jsonMessage.getInt("id");
                sessionHandler.acceptTask(id);
            }else{
                TaskWithAttachment task = new TaskWithAttachment();
                task.setId(jsonMessage.getInt("id"));
                task.setName(jsonMessage.getString("name"));
                task.setDescription(jsonMessage.getString("description"));
                task.setLocation(jsonMessage.getString("location"));
                task.setCompletionUser(jsonMessage.getString("completionUser"));
                task.setCreationTime(jsonMessage.getString("creationTime"));
                task.setCompletionTime(jsonMessage.getString("completionTime"));
                task.setIsCancelled(jsonMessage.getBoolean("isCancelled"));
                task.setIsUrgent(jsonMessage.getBoolean("isUrgent"));
                task.setfileId(jsonMessage.getInt("fileId"));
                task.setFileName(jsonMessage.getString("fileName"));
                task.setFileLink(jsonMessage.getString("fileLink"));
                sessionHandler.addTask(task);
            }
        }
    }
    
    public static WebSocketServer getInstance() {
        return WebSocketServerHolder.INSTANCE;
    }
    
    private static class WebSocketServerHolder {

        private static final WebSocketServer INSTANCE = new WebSocketServer();
    }
    
}
