/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package websocket;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
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
    private static List<TaskWithAttachment> tasks = new ArrayList<>();

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
            TaskWithAttachment task;
            int departmentId = 0;
            switch(action){
                case "add":
                    task = new TaskWithAttachment();
                    task.setId(jsonMessage.getInt("id"));
                    task.setName(jsonMessage.getString("name"));
                    task.setDescription(jsonMessage.getString("description"));
                    task.setLocation(jsonMessage.getString("location"));
                    task.setDepartment(jsonMessage.getInt("department"));
                    task.setCreationUser(jsonMessage.getString("creationUser"));
                    task.setCompletionUser(jsonMessage.getString("completionUser"));
                    task.setCreationTime(jsonMessage.getString("creationTime"));
                    task.setCompletionTime(jsonMessage.getString("completionTime"));
                    task.setIsCancelled(jsonMessage.getBoolean("isCancelled"));
                    task.setIsUrgent(jsonMessage.getBoolean("isUrgent"));
                    task.setfileId(jsonMessage.getInt("fileId"));
                    task.setFileName(jsonMessage.getString("fileName"));
                    task.setFileLink(jsonMessage.getString("fileLink"));
                    returnMessage = addTask(task);
                    departmentId = task.getDepartment();
                    break;
                case "cancel":
                    int cancelId = (int) jsonMessage.getInt("id");
                    task = tasks.get(getTaskIndex(cancelId));
                    task.setIsCancelled(jsonMessage.getBoolean("isCancelled"));
                    returnMessage = cancelTask(task);
                    departmentId = task.getDepartment();
                    break;
                case "accept":
                    int acceptId = (int) jsonMessage.getInt("id");
                    task = tasks.get(getTaskIndex(acceptId));
                    task.setCompletionUser(jsonMessage.getString("completionUser"));
                    returnMessage = acceptTask(task);
                    departmentId = task.getDepartment();
                    break;
                case "complete":
                    int doneId = (int) jsonMessage.getInt("id");
                    task = tasks.get(getTaskIndex(doneId));
                    task.setCompletionTime(jsonMessage.getString("completionTime"));
                    returnMessage = completeTask(task);
                    departmentId = task.getDepartment();
                    break;
            }
            synchronized (sessions) {
                for (Session session : sessions) {
                    if (session.isOpen()) {
//                        System.out.println(session.getRequestURI().toString());
                        String uri = session.getRequestURI().toString();
                        char depIdFromURI = uri.charAt(uri.length()-1);
                        if(Character.getNumericValue(depIdFromURI) == departmentId){
                            session.getAsyncRemote().sendText(returnMessage);
                        }
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
    
    public static void setTasks(List<TaskWithAttachment> allTasks){
        System.out.println("set tasks");
        for(TaskWithAttachment t : allTasks){
            tasks.add(t);
        }
    }
    
    public static String addTask(TaskWithAttachment task) {
        System.out.println("add task");
        tasks.add(task);
        JsonObject addMessage = createMessage(task, "add");
        return addMessage.toString();
    }

    public static String cancelTask(TaskWithAttachment task) {
        System.out.println("cancel task");
        if(task != null){
            JsonObject removeMessage = createMessage(task, "cancel");
            return removeMessage.toString();
        }
        return null;
    }

    public static String acceptTask(TaskWithAttachment task) {
        System.out.println("accept task");
        if(task != null){
            JsonObject updateMessage = createMessage(task, "accept");
            return updateMessage.toString();
        }
        return null;
    }
    
    public static String completeTask(TaskWithAttachment task) {
        System.out.println("complete task");
        if(task != null){
            JsonObject updateMessage = createMessage(task, "complete");
            return updateMessage.toString();
        }
        return null;
    }
    
    private static int getTaskIndex(int id){
        int index = -1;
        for(int i=0; i<tasks.size(); i++){
            if(tasks.get(i).getId() == id){
                index = i;
            }
        }
        System.out.println("index: " + index);
        return index;
    }

    private static JsonObject createMessage(TaskWithAttachment task, String action) {
        JsonProvider provider = JsonProvider.provider();
        JsonObject addMessage = provider.createObjectBuilder()
                .add("action", action)
                .add("id", task.getId())
                .add("name", task.getName())
                .add("location", task.getLocation())
                .add("creationUser", task.getCreationUser())
                .add("completionUser", task.getCompletionUser())
                .add("description", task.getDescription())
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
