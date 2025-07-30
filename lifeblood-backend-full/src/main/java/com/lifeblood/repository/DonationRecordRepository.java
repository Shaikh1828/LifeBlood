package com.lifeblood.repository;

import com.lifeblood.model.DonationRecord;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Stateless
public class DonationRecordRepository {

    @PersistenceContext(unitName = "lifebloodPU")
    private EntityManager em;

    public void save(DonationRecord record) {
        em.persist(record);
    }

    public List<DonationRecord> findByDonor(Long donorId) {
        return em.createQuery("SELECT d FROM DonationRecord d WHERE d.donor.id = :id", DonationRecord.class)
                .setParameter("id", donorId)
                .getResultList();
    }
}
