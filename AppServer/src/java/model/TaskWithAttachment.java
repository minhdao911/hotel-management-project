/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import java.sql.Timestamp;
import java.util.Date;
import settings.ProjectSettings;

/**
 *
 * @author minhdao
 */
public class TaskWithAttachment {
    
    private int id;
    private String name;
    private String location;
    private String description;
    private int department;
    private String creationUser;
    private String completionUser;
    private String creationTime;
    private String completionTime;
    private boolean isCancelled;
    private boolean isUrgent;
    private int fileId;
    private String fileName;
    private String fileLink;
    
    public TaskWithAttachment(){
        this.description = "";
        this.completionUser = "";
        this.completionTime = "";
        this.fileId = 0;
        this.fileName = "";
        this.fileLink = "";
    }
    
    public TaskWithAttachment(int id, String taskName, String location, String desc, int dep, String creationTime,
             String completionTime, boolean isCancelled, boolean isUrgent, int fileId, String fileName, 
             String creationUser, String completionUser){
        this.id = id;
        this.name = taskName;
        this.location = location;
        this.creationUser = creationUser;
        this.completionUser = completionUser;
        this.description = desc;
        this.department = dep;
        this.creationTime = creationTime;
        this.completionTime = completionTime;
        this.isCancelled = isCancelled;
        this.isUrgent = isUrgent;
        this.fileId = fileId;
        this.fileName = fileName;
        this.fileLink = "http://" + ProjectSettings.HOSTNAME + "/AppServer/download?id="+fileId;
    }
    
    public TaskWithAttachment(int id, String taskName, String location, String desc, int dep,
            String creationTime, String completionTime, boolean isCancelled, 
            boolean isUrgent, String creationUser, String completionUser){
        this.id = id;
        this.name = taskName;
        this.location = location;
        this.department = dep;
        this.creationUser = creationUser;
        this.completionUser = completionUser;
        this.description = desc;
        this.creationTime = creationTime;
        this.completionTime = completionTime;
        this.isCancelled = isCancelled;
        this.isUrgent = isUrgent;
//        this.status = status;
    }
    
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
    
    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description){
        this.description = description;
    }

    public String getCreationUser() {
        return creationUser;
    }

    public void setCreationUser(String creationUser) {
        this.creationUser = creationUser;
    }
    
    public String getCompletionUser() {
        return completionUser;
    }
    
    public void setCompletionUser(String user) {
        this.completionUser = user;
    }

    public int getDepartment() {
        return department;
    }

    public void setDepartment(int department) {
        this.department = department;
    }

    public String getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(String creationTime) {
        this.creationTime = creationTime;
    }

    public String getCompletionTime() {
        return completionTime;
    }

    public void setCompletionTime(String completionTime) {
        this.completionTime = completionTime;
    }

    public boolean getIsCancelled() {
        return isCancelled;
    }

    public void setIsCancelled(boolean isCancelled) {
        this.isCancelled = isCancelled;
    }

    public boolean getIsUrgent() {
        return isUrgent;
    }

    public void setIsUrgent(boolean isUrgent) {
        this.isUrgent = isUrgent;
    }
    
    public String getName(){
        return name;
    }
    
    public void setName(String taskName){
        this.name = taskName;
    }
    
    public int getfileId(){
        return fileId;
    }
    
    public void setfileId(int fileId){
        this.fileId = fileId;
    }
    
    public String getFileName(){
        return fileName;
    }
    
    public void setFileName(String fileName){
        this.fileName = fileName;
    }
    
    public String getFileLink(){
        return fileLink;
    }
    
    public void setFileLink(String fileLink){
        this.fileLink = fileLink;
    }
}
