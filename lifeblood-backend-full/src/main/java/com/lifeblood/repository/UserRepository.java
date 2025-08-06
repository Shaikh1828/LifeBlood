package com.lifeblood.repository;

import com.lifeblood.model.User;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Stateless
public class UserRepository {

    @PersistenceContext(unitName = "lifebloodPU")
    private EntityManager em;

    public void save(User user) {
        em.persist(user);
    }

    public User findById(Long id) {
        return em.find(User.class, id);
    }

    public User findByEmail(String email) {
        try {
            return em.createQuery("SELECT u FROM User u WHERE u.email = :email", User.class)
                    .setParameter("email", email)
                    .getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    public void update(User user) {
        em.merge(user);
    }

    public List<User> findAll() {
        return em.createQuery("SELECT u FROM User u", User.class).getResultList();
    }

    public List<User> findByLocationAndBlood(User.BloodGroup bloodGroup, String division, String district, String upazila) {
        return em.createQuery(
                        "SELECT u FROM User u WHERE u.bloodGroup = :bg AND u.division = :div AND u.district = :dist AND u.upazila = :upa AND u.isActive = true AND u.isVerified = true",
                        User.class
                )
                .setParameter("bg", bloodGroup)
                .setParameter("div", division)
                .setParameter("dist", district)
                .setParameter("upa", upazila)
                .getResultList();
    }



}