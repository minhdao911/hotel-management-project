/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package service;

import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Tuple;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Root;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.QueryParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import model.Attachment;
import model.Department;
import model.Employee;
import model.Task;
import model.TaskWithAttachment;
import org.codehaus.jackson.map.ObjectMapper;
import websocket.WebSocketServer;

/**
 *
 * @author minhdao
 */
@Stateless
@Path("task")
public class TaskFacadeREST extends AbstractFacade<Task> {

    @PersistenceContext(unitName = "AppServerTestPU")
     EntityManager em;
    
    ObjectMapper mapper = new ObjectMapper();

    public TaskFacadeREST() {
        super(Task.class);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public Task create(@QueryParam("name") String name, @QueryParam("location") String loc,
            @QueryParam("desc") String desc, @QueryParam("dep") int dep,
            @QueryParam("urgent") String urgent) {
        
        Task entity = new Task();
        
        boolean isUrgent = false;
        if(urgent.equals("true")) isUrgent = true;
        
        if(!desc.isEmpty()){
            entity.setDescription(desc);
        }
        
        Department d = em.getReference(Department.class, dep);
        
        entity.setName(name);
        entity.setLocation(loc);
        entity.setDepartment(d);
        entity.setIsUrgent(isUrgent);
        entity.setCreationTime(new Timestamp(System.currentTimeMillis()));
        
        super.create(entity);
        return entity;
    }

    @PUT
    @Path("{id}/{userName}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public void editCompletionUser(@PathParam("id") int id, 
            @PathParam("userName") String completionUser){
        Task t = em.find(Task.class, id);
        Employee e = (Employee)em.createNamedQuery("Employee.findByUserName")
            .setParameter("userName", completionUser)
            .getSingleResult();
        t.setCompletionUser(e);
        super.edit(t);
        TaskWithAttachment twa = new TaskWithAttachment();
        twa.setId(t.getId());
        twa.setCompletionUser(t.getCompletionUser().getUserName());
        System.out.println("completionUser: " + t.getCompletionUser().getUserName());
        try{
            WebSocketServer.sendAll(mapper.writeValueAsString(twa), "accept");
        }catch(Exception ex){
            System.out.println(ex);
        }
        
    }
    
    @PUT
    @Path("{id}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public void editCompletionTime(@PathParam("id") int id, 
            @PathParam("completionTime") String completionTime){
        Task t = em.find(Task.class, id);
        t.setCompletionTime(new Timestamp(System.currentTimeMillis()));
        super.edit(t);
        TaskWithAttachment twa = new TaskWithAttachment();
        twa.setId(t.getId());
        twa.setCompletionTime(t.getCompletionTime().toString());
        System.out.println("completionTime: " + t.getCompletionTime().toString());
        try{
            WebSocketServer.sendAll(mapper.writeValueAsString(twa), "complete");
        }catch(Exception ex){
            System.out.println(ex);
        }
    }
    
    @PUT
    @Path("cancel/{id}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public void editCancel(@PathParam("id") int id){
        Task t = em.find(Task.class, id);
        t.setIsCancelled(true);
        super.edit(t);
        TaskWithAttachment twa = new TaskWithAttachment();
        twa.setId(t.getId());
        twa.setIsCancelled(true);
        try{
            WebSocketServer.sendAll(mapper.writeValueAsString(twa), "cancel");
        }catch(Exception ex){
            System.out.println(ex);
        }
    }

    @DELETE
    @Path("{id}")
    public void remove(@PathParam("id") Integer id) {
        super.remove(super.find(id));
    }

    @GET
    @Path("{id}")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public Task find(@PathParam("id") Integer id) {
        return super.find(id);
    }

    @GET
    @Override
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<Task> findAll() {
        return super.findAll();
    }
    
    @GET
    @Path("set")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public void setTasks() {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Tuple> cq = cb.createTupleQuery();
        Root<Task> task = cq.from(Task.class);
        Join<Task, Attachment> a = task.join("attachments", JoinType.LEFT);
        cq.multiselect(task, a.get("id"), a.get("fileName"));
        TypedQuery<Tuple> q = em.createQuery(cq);
        WebSocketServer.setTasks(getResults(q.getResultList()));
    }

    @GET
    @Path("{from}/{to}")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<Task> findRange(@PathParam("from") Integer from, @PathParam("to") Integer to) {
        return super.findRange(new int[]{from, to});
    }

    @GET
    @Path("count")
    @Produces(MediaType.TEXT_PLAIN)
    public String countREST() {
        return String.valueOf(super.count());
    }
    
    @GET
    @Path("dep/{departmentid}")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<TaskWithAttachment> getTaskOfDepartment(@PathParam("departmentid") int id){
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Tuple> cq = cb.createTupleQuery();
        Root<Task> task = cq.from(Task.class);
        Join<Task, Attachment> a = task.join("attachments", JoinType.LEFT);
        cq.multiselect(task, a.get("id"), a.get("fileName"));
        cq.where(
            cb.equal(task.get("department"), new Department(id))
        );
        cq.orderBy(cb.desc(task.get("creationTime")));
        TypedQuery<Tuple> q = em.createQuery(cq);
//        List<TaskWithAttachment> tasks = new ArrayList<TaskWithAttachment>();
//        for(Tuple t : q.getResultList()){
//            Task tk = t.get(0, Task.class);
//            if(t.get(2) == null){
//                tasks.add(new TaskWithAttachment(tk.getId(), tk.getName(), tk.getLocation(), tk.getDescription(),
//                tk.getCreationTime(), tk.getCompletionTime(), tk.getIsCancelled(), tk.getIsUrgent(), tk.getCompletionUser().getUserName()));
//            }else{
//                tasks.add(new TaskWithAttachment(tk.getId(), tk.getName(), tk.getLocation(), tk.getDescription(),
//                tk.getCreationTime(), tk.getCompletionTime(), tk.getIsCancelled(), 
//                        tk.getIsUrgent(), (int)t.get(1), (String)t.get(2), tk.getCompletionUser().getUserName()));
//            }
//        }
//        return tasks;
        return getResults(q.getResultList());
    }
    
    @GET
    @Path("dep/{departmentid}/new")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<TaskWithAttachment> getNewTaskOfDepartment(@PathParam("departmentid") int id){
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Tuple> cq = cb.createTupleQuery();
        Root<Task> task = cq.from(Task.class);
        Join<Task, Attachment> a = task.join("attachments", JoinType.LEFT);
        cq.multiselect(task, a.get("id"), a.get("fileName"));
        cq.where(
            cb.and(
                cb.equal(task.get("department"), new Department(id)),
                cb.isNull(task.get("completionUser")),
                cb.isFalse(task.get("isCancelled")),
                cb.isFalse(task.get("isUrgent"))
            ) 
        );
        cq.orderBy(cb.desc(task.get("creationTime")));
        TypedQuery<Tuple> q = em.createQuery(cq);
//        List<TaskWithAttachment> tasks = new ArrayList<TaskWithAttachment>();
//        for(Tuple t : q.getResultList()){
//            Task tk = t.get(0, Task.class);
//            if(t.get(2) == null){
//                tasks.add(new TaskWithAttachment(tk.getId(), tk.getName(), tk.getLocation(), tk.getDescription(),
//                tk.getCreationTime(), tk.getCompletionTime(), tk.getIsCancelled(), tk.getIsUrgent(), tk.getCompletionUser().getUserName()));
//            }else{
//                tasks.add(new TaskWithAttachment(tk.getId(), tk.getName(), tk.getLocation(), tk.getDescription(),
//                tk.getCreationTime(), tk.getCompletionTime(), tk.getIsCancelled(), 
//                        tk.getIsUrgent(), (int)t.get(1), (String)t.get(2), tk.getCompletionUser().getUserName()));
//            }
//        }
//        return tasks;
        return getResults(q.getResultList());
    }
    
    @GET
    @Path("dep/{departmentid}/process")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<TaskWithAttachment> getInprocessTaskOfDepartment(@PathParam("departmentid") int id){
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Tuple> cq = cb.createTupleQuery();
        Root<Task> task = cq.from(Task.class);
        Join<Task, Attachment> a = task.join("attachments", JoinType.LEFT);
        cq.multiselect(task, a.get("id"), a.get("fileName"));
        cq.where(
            cb.and(
                cb.equal(task.get("department"), new Department(id)),
                cb.isNotNull(task.get("completionUser")),
                cb.isNull(task.get("completionTime")),
                cb.isFalse(task.get("isCancelled")),
                cb.isFalse(task.get("isUrgent"))
            ) 
        );
        cq.orderBy(cb.desc(task.get("creationTime")));
        TypedQuery<Tuple> q = em.createQuery(cq);
//        List<TaskWithAttachment> tasks = new ArrayList<TaskWithAttachment>();
//        for(Tuple t : q.getResultList()){
//            Task tk = t.get(0, Task.class);
//            if(t.get(2) == null){
//                tasks.add(new TaskWithAttachment(tk.getId(), tk.getName(), tk.getLocation(), tk.getDescription(),
//                tk.getCreationTime(), tk.getCompletionTime(), tk.getIsCancelled(), tk.getIsUrgent(), tk.getCompletionUser().getUserName()));
//            }else{
//                tasks.add(new TaskWithAttachment(tk.getId(), tk.getName(), tk.getLocation(), tk.getDescription(),
//                tk.getCreationTime(), tk.getCompletionTime(), tk.getIsCancelled(), 
//                        tk.getIsUrgent(), (int)t.get(1), (String)t.get(2), tk.getCompletionUser().getUserName()));
//            }
//        }
//        return tasks;
        return getResults(q.getResultList());
    }
    
    @GET
    @Path("dep/{departmentid}/completed")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<TaskWithAttachment> getCompletedTaskOfDepartment(@PathParam("departmentid") int id){
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Tuple> cq = cb.createTupleQuery();
        Root<Task> task = cq.from(Task.class);
        Join<Task, Attachment> a = task.join("attachments", JoinType.LEFT);
        cq.multiselect(task, a.get("id"), a.get("fileName"));
        cq.where(
            cb.and(
                cb.equal(task.get("department"), new Department(id)),
                cb.isNotNull(task.get("completionUser")),
                cb.isNotNull(task.get("completionTime"))
            ) 
        );
        cq.orderBy(cb.desc(task.get("creationTime")));
        TypedQuery<Tuple> q = em.createQuery(cq);
//        List<TaskWithAttachment> tasks = new ArrayList<TaskWithAttachment>();
//        for(Tuple t : q.getResultList()){
//            Task tk = t.get(0, Task.class);
//            if(t.get(2) == null){
//                tasks.add(new TaskWithAttachment(tk.getId(), tk.getName(), tk.getLocation(), tk.getDescription(),
//                tk.getCreationTime(), tk.getCompletionTime(), tk.getIsCancelled(), tk.getIsUrgent(), tk.getCompletionUser().getUserName()));
//            }else{
//                tasks.add(new TaskWithAttachment(tk.getId(), tk.getName(), tk.getLocation(), tk.getDescription(),
//                tk.getCreationTime(), tk.getCompletionTime(), tk.getIsCancelled(), 
//                        tk.getIsUrgent(), (int)t.get(1), (String)t.get(2), tk.getCompletionUser().getUserName()));
//            }
//        }
//        return tasks;
        return getResults(q.getResultList());
    }
    
    @GET
    @Path("dep/{departmentid}/cancelled")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<TaskWithAttachment> getCancelledTaskOfDepartment(@PathParam("departmentid") int id){
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Tuple> cq = cb.createTupleQuery();
        Root<Task> task = cq.from(Task.class);
        Join<Task, Attachment> a = task.join("attachments", JoinType.LEFT);
        cq.multiselect(task, a.get("id"), a.get("fileName"));
        cq.where(
            cb.and(
                cb.equal(task.get("department"), new Department(id)),
                cb.isTrue(task.get("isCancelled"))
            ) 
        );
        cq.orderBy(cb.desc(task.get("creationTime")));
        TypedQuery<Tuple> q = em.createQuery(cq);
//        List<TaskWithAttachment> tasks = new ArrayList<TaskWithAttachment>();
//        for(Tuple t : q.getResultList()){
//            Task tk = t.get(0, Task.class);
//            if(t.get(2) == null){
//                tasks.add(new TaskWithAttachment(tk.getId(), tk.getName(), tk.getLocation(), tk.getDescription(),
//                tk.getCreationTime(), tk.getCompletionTime(), tk.getIsCancelled(), tk.getIsUrgent(), tk.getCompletionUser().getUserName()));
//            }else{
//                tasks.add(new TaskWithAttachment(tk.getId(), tk.getName(), tk.getLocation(), tk.getDescription(),
//                tk.getCreationTime(), tk.getCompletionTime(), tk.getIsCancelled(), 
//                        tk.getIsUrgent(), (int)t.get(1), (String)t.get(2), tk.getCompletionUser().getUserName()));
//            }
//        }
//        return tasks;
        return getResults(q.getResultList());
    }
    
    @GET
    @Path("dep/{departmentid}/urgent/new")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<TaskWithAttachment> getNewUrgentTaskOfDepartment(@PathParam("departmentid") int id){
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Tuple> cq = cb.createTupleQuery();
        Root<Task> task = cq.from(Task.class);
        Join<Task, Attachment> a = task.join("attachments", JoinType.LEFT);
        cq.multiselect(task, a.get("id"), a.get("fileName"));
        cq.where(
            cb.and(
                cb.equal(task.get("department"), new Department(id)),
                cb.isNull(task.get("completionUser")),
                cb.isFalse(task.get("isCancelled")),
                cb.isTrue(task.get("isUrgent"))
            ) 
        );
        cq.orderBy(cb.desc(task.get("creationTime")));
        TypedQuery<Tuple> q = em.createQuery(cq);
//        List<TaskWithAttachment> tasks = new ArrayList<TaskWithAttachment>();
//        for(Tuple t : q.getResultList()){
//            Task tk = t.get(0, Task.class);
//            if(t.get(2) == null){
//                tasks.add(new TaskWithAttachment(tk.getId(), tk.getName(), tk.getLocation(), tk.getDescription(),
//                tk.getCreationTime(), tk.getCompletionTime(), tk.getIsCancelled(), tk.getIsUrgent(), tk.getCompletionUser().getUserName()));
//            }else{
//                tasks.add(new TaskWithAttachment(tk.getId(), tk.getName(), tk.getLocation(), tk.getDescription(),
//                tk.getCreationTime(), tk.getCompletionTime(), tk.getIsCancelled(), 
//                        tk.getIsUrgent(), (int)t.get(1), (String)t.get(2), tk.getCompletionUser().getUserName()));
//            }
//        }
//        return tasks;
        return getResults(q.getResultList());
    }
    
    @GET
    @Path("dep/{departmentid}/urgent/process")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<TaskWithAttachment> getProcessUrgentTaskOfDepartment(@PathParam("departmentid") int id){
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Tuple> cq = cb.createTupleQuery();
        Root<Task> task = cq.from(Task.class);
        Join<Task, Attachment> a = task.join("attachments", JoinType.LEFT);
        cq.multiselect(task, a.get("id"), a.get("fileName"));
        cq.where(
            cb.and(
                cb.equal(task.get("department"), new Department(id)),
                cb.isNotNull(task.get("completionUser")),
                cb.isNull(task.get("completionTime")),
                cb.isFalse(task.get("isCancelled")),
                cb.isTrue(task.get("isUrgent"))
            ) 
        );
        cq.orderBy(cb.desc(task.get("creationTime")));
        TypedQuery<Tuple> q = em.createQuery(cq);
//        List<TaskWithAttachment> tasks = new ArrayList<TaskWithAttachment>();
//        for(Tuple t : q.getResultList()){
//            Task tk = t.get(0, Task.class);
//            if(t.get(2) == null){
//                tasks.add(new TaskWithAttachment(tk.getId(), tk.getName(), tk.getLocation(), tk.getDescription(),
//                tk.getCreationTime(), tk.getCompletionTime(), tk.getIsCancelled(), tk.getIsUrgent(), tk.getCompletionUser().getUserName()));
//            }else{
//                tasks.add(new TaskWithAttachment(tk.getId(), tk.getName(), tk.getLocation(), tk.getDescription(),
//                tk.getCreationTime(), tk.getCompletionTime(), tk.getIsCancelled(), 
//                        tk.getIsUrgent(), (int)t.get(1), (String)t.get(2), tk.getCompletionUser().getUserName()));
//            }
//        }
//        return tasks;
        return getResults(q.getResultList());
    }
    
    public List<TaskWithAttachment> getResults(List<Tuple> results){
        List<TaskWithAttachment> tasks = new ArrayList<>();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        for(Tuple t : results){
            Task tk = t.get(0, Task.class);
            String username = null;
            String completionTime = null;
            if(tk.getCompletionUser() != null) username = tk.getCompletionUser().getUserName();
            if(tk.getCompletionTime() != null) completionTime = dateFormat.format(tk.getCompletionTime());
            if(t.get(2) == null){
                tasks.add(new TaskWithAttachment(tk.getId(), tk.getName(), tk.getLocation(), tk.getDescription(),
                dateFormat.format(tk.getCreationTime()), completionTime, tk.getIsCancelled(), tk.getIsUrgent(), username));
            }else{
                tasks.add(new TaskWithAttachment(tk.getId(), tk.getName(), tk.getLocation(), tk.getDescription(),
                dateFormat.format(tk.getCreationTime()), completionTime, tk.getIsCancelled(), 
                        tk.getIsUrgent(), (int)t.get(1), (String)t.get(2), username));
            }
        }
        return tasks;
    }

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }
    
}