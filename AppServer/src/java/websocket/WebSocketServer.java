/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package websocket;

import java.io.IOException;
import java.io.StringReader;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.json.spi.JsonProvider;
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
    
    private static final Set<Session> sessions = new HashSet<>();
    private static Set<TaskWithAttachment> tasks = new HashSet<>();
    
//    @Inject
//    private SessionHandler sessionHandler;

    @OnOpen
    public void onOpen(Session session) {
        System.out.println("add session");
        sessions.add(session);
    }

    @OnClose
    public void onClose(Session session) {
        System.out.println("remove session");
        sessions.remove(session);
    }

    @OnError
    public void onError(Throwable error) {
        Logger.getLogger(WebSocketServer.class.getName()).log(Level.SEVERE, null, error);
    }
    
    public static void sendAll(String message, String action) {
        try (JsonReader reader = Json.createReader(new StringReader(message))) {
            JsonObject jsonMessage = reader.readObject();
            String returnMessage = "";
            
            switch(action){
                case "add":
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
                    returnMessage = addTask(task);
                    break;
                case "cancel":
                    int cancelId = (int) jsonMessage.getInt("id");
                    returnMessage = cancelTask(cancelId);
                    break;
                case "accept":
                    int acceptId = (int) jsonMessage.getInt("id");
                    returnMessage = cancelTask(acceptId);
                    break;
            }
            synchronized (sessions) {
                for (Session session : sessions) {
                    if (session.isOpen()) {
                        session.getAsyncRemote().sendText(returnMessage);
                    }
                }
            }
        }
    }
    
    public static WebSocketServer getInstance() {
        return WebSocketServerHolder.INSTANCE;
    }
    
    private static class WebSocketServerHolder {

        private static final WebSocketServer INSTANCE = new WebSocketServer();
    }
    
    public static String addTask(TaskWithAttachment task) {
        System.out.println("add task");
        tasks.add(task);
        JsonObject addMessage = createAddMessage(task);
        return addMessage.toString();
    }

    public static String cancelTask(int id) {
        TaskWithAttachment task = getTaskById(id);
        if(task != null){
            tasks.remove(task);
            JsonProvider provider = JsonProvider.provider();
            JsonObject removeMessage = provider.createObjectBuilder()
                    .add("action", "cancel")
                    .add("id", id)
                    .build();
            return removeMessage.toString();
        }
        return null;
    }

    public static String acceptTask(int id) {
        TaskWithAttachment task = getTaskById(id);
        if(task != null){
            JsonProvider provider = JsonProvider.provider();
            JsonObject updateMessage = provider.createObjectBuilder()
                    .add("action", "accept")
                    .add("id", id)
                    .build();
            return updateMessage.toString();
        }
        return null;
    }

    private static TaskWithAttachment getTaskById(int id) {
        for (TaskWithAttachment t : tasks) {
            if (t.getId() == id) {
                return t;
            }
        }
        return null;
    }

    private static JsonObject createAddMessage(TaskWithAttachment task) {
        JsonProvider provider = JsonProvider.provider();
        JsonObject addMessage = provider.createObjectBuilder()
                .add("action", "add")
                .add("id", task.getId())
                .add("name", task.getName())
                .add("location", task.getLocation())
                .add("description", task.getDescription())
                .add("completionUser", task.getCompletionUser())
                .add("creationTime", task.getCreationTime())
                .add("completionTime", task.getCompletionTime())
                .add("isCancelled", task.getIsCancelled())
                .add("isUrgent", task.getIsUrgent())
                .add("fileId", task.getfileId())
                .add("fileName", task.getFileName())
                .add("fileLink", task.getFileLink())
                .build();
        return addMessage;
    }
}
