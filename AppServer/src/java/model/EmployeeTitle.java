/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import java.io.Serializable;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author minhdao
 */
@Entity
@Table(name = "employeeTitle")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "EmployeeTitle.findAll", query = "SELECT e FROM EmployeeTitle e")
    , @NamedQuery(name = "EmployeeTitle.findById", query = "SELECT e FROM EmployeeTitle e WHERE e.id = :id")
    , @NamedQuery(name = "EmployeeTitle.findByName", query = "SELECT e FROM EmployeeTitle e WHERE e.name = :name")})
public class EmployeeTitle implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;
    
    @JoinColumn(name = "department", referencedColumnName = "id")
    @ManyToOne
    private Department department;

    public EmployeeTitle() {
    }

    public EmployeeTitle(Integer id) {
        this.id = id;
    }

    public EmployeeTitle(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof EmployeeTitle)) {
            return false;
        }
        EmployeeTitle other = (EmployeeTitle) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "model.EmployeeTitle[ id=" + id + " ]";
    }
    
}
