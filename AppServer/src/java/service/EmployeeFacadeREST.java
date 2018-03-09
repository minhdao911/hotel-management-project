/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package service;

import Utilities.UPGenerator;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import model.Department;
import model.Employee;
import model.EmployeeTitle;

/**
 *
 * @author minhdao
 */
@Stateless
@Path("employee")
public class EmployeeFacadeREST extends AbstractFacade<Employee> {

    @PersistenceContext(unitName = "AppServerPU")
    private EntityManager em;

    public EmployeeFacadeREST() {
        super(Employee.class);
    }

    @POST
    @Path("login/{username}/{password}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_XML})
    public Employee login(@PathParam("username") String usrname, 
            @PathParam("password") String pass) {
        
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Employee> cq = cb.createQuery(Employee.class);
        Root<Employee> emp = cq.from(Employee.class);
        cq.select(emp);
        cq.where(
            cb.and(
                cb.equal(emp.get("userName"), usrname),
                cb.equal(emp.get("password"), pass)
            )
        );
        TypedQuery<Employee> q = em.createQuery(cq);
        if (q.getResultList().isEmpty()){
            return null;
        }
        return q.getSingleResult();
    }
    
    @POST
    @Path("{firstName}/{lastName}/{dep}/{title}")
    @Consumes(MediaType.APPLICATION_JSON)
    public void createUser(@PathParam("firstName") String fn, @PathParam("lastName") String ln,
            @PathParam("dep") int dep, @PathParam("title") int title){
        Employee e = new Employee();
        UPGenerator up = new UPGenerator();
        e.setFirstName(fn);
        e.setLastName(ln);
        e.setUserName(up.generateUsername(fn, ln));
        e.setPassword(up.generatePassword(fn, ln));
        Department d = em.getReference(Department.class, dep);
        EmployeeTitle et = em.getReference(EmployeeTitle.class, title);
        e.setDepartment(d);
        e.setEmployeeTitle(et);
        super.create(e);
    }

    @PUT
    @Path("{id}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public void edit(@PathParam("id") Integer id, Employee entity) {
        super.edit(entity);
    }
    
    @PUT
    @Path("{id}/{newpass}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public void editPass(@PathParam("id") int id, @PathParam("newpass") String newPass) {
        Employee e = super.find(id);
        e.setPassword(newPass);
        super.edit(e);
    }

    @DELETE
    @Path("{id}")
    public void remove(@PathParam("id") Integer id) {
        super.remove(super.find(id));
    }

    @GET
    @Path("{id}")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public Employee find(@PathParam("id") Integer id) {
        return super.find(id);
    }

    @GET
    @Override
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<Employee> findAll() {
        return super.findAll();
    }

    @GET
    @Path("{from}/{to}")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<Employee> findRange(@PathParam("from") Integer from, @PathParam("to") Integer to) {
        return super.findRange(new int[]{from, to});
    }

    @GET
    @Path("count")
    @Produces(MediaType.TEXT_PLAIN)
    public String countREST() {
        return String.valueOf(super.count());
    }

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }
    
}