package com.shinhan.naengtureat.store.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StoreService {
	
	@Autowired
	StoreRepository storeRepository;

}
