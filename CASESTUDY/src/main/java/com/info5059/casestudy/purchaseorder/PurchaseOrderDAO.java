package com.info5059.casestudy.purchaseorder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.info5059.casestudy.product.Product;
import com.info5059.casestudy.product.ProductRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDateTime;

@Component
public class PurchaseOrderDAO {
    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private ProductRepository prodRepo;

    @Transactional
    public PurchaseOrder create(PurchaseOrder clientPurchase) {
        PurchaseOrder realPurchaseOrder = new PurchaseOrder();

        realPurchaseOrder.setPodate(LocalDateTime.now());
        realPurchaseOrder.setVendorid(clientPurchase.getVendorid());
        realPurchaseOrder.setAmount(clientPurchase.getAmount());
        entityManager.persist(realPurchaseOrder);

        for (PurchaseOrderLineitem item : clientPurchase.getItems()) {
            PurchaseOrderLineitem realItem = new PurchaseOrderLineitem();
            realItem.setProductid(item.getProductid());
            realItem.setPoid(realPurchaseOrder.getId());
            realItem.setPrice(item.getPrice());
            realItem.setQty(item.getQty());

            // we also need to update the QOO on the product table
            Product prod = prodRepo.getReferenceById(item.getProductid());
            prod.setQoo(prod.getQoo() + item.getQty());
            prodRepo.saveAndFlush(prod);
            entityManager.persist(realItem);
        }

        entityManager.flush();
        entityManager.refresh(realPurchaseOrder);
        return realPurchaseOrder;
    }
}