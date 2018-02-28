/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package websocket;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.enterprise.context.ApplicationScoped;
import javax.json.JsonObject;
import javax.json.spi.JsonProvider;
import javax.websocket.Session;
import model.TaskWithAttachment;

/**
 *
 * @author minhdao
 */

@ApplicationScoped
public class SessionHandler {
    
    private Set<Session> sessions = new HashSet<>();
    private Set<TaskWithAttachment> tasks = new HashSet<>();
    
    public void addSession(Session session) {
        sessions.add(session);
    }

    public void removeSession(Session session) {
        sessions.remove(session);
    }
    
    public List<TaskWithAttachment> getTasks() {
        return new ArrayList<>(tasks);
    }

    public void addTask(TaskWithAttachment task) {
        tasks.add(task);
        JsonObject addMessage = createAddMessage(task);
        sendToAllConnectedSessions(addMessage);
    }

    public void cancelTask(int id) {
        TaskWithAttachment task = getTaskById(id);
        if(task != null){
            tasks.remove(task);
            JsonProvider provider = JsonProvider.provider();
            JsonObject removeMessage = provider.createObjectBuilder()
                    .add("action", "cancel")
                    .add("id", id)
                    .build();
            sendToAllConnectedSessions(removeMessage);
        }
    }

    public void acceptTask(int id) {
        TaskWithAttachment task = getTaskById(id);
        if(task != null){
            JsonProvider provider = JsonProvider.provider();
            JsonObject updateMessage = provider.createObjectBuilder()
                    .add("action", "accept")
                    .add("id", id)
                    .build();
            sendToAllConnectedSessions(updateMessage);
        }
    }

    private TaskWithAttachment getTaskById(int id) {
        for (TaskWithAttachment t : tasks) {
            if (t.getId() == id) {
                return t;
            }
        }
        return null;
    }

    private JsonObject createAddMessage(TaskWithAttachment task) {
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

    private void sendToAllConnectedSessions(JsonObject message) {
        for (Session session : sessions) {
            sendToSession(session, message);
        }
    }

    private void sendToSession(Session session, JsonObject message) {
        try {
            session.getBasicRemote().sendText(message.toString());
        } catch (IOException ex) {
            sessions.remove(session);
            Logger.getLogger(SessionHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
}
