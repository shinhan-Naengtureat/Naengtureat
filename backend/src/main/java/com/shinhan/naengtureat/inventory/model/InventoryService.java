package com.shinhan.naengtureat.inventory.model;


import com.querydsl.core.types.Predicate;
import com.shinhan.naengtureat.ingredient.dto.IngredientComparisonDTO;
import com.shinhan.naengtureat.ingredient.dto.IngredientDTO;
import com.shinhan.naengtureat.ingredient.model.IngredientRepository;
import com.shinhan.naengtureat.ingredient.model.IngredientService;
import com.shinhan.naengtureat.inventory.dto.InventoryRequestDTO;
import com.shinhan.naengtureat.inventory.dto.InventoryResponseDTO;
import com.shinhan.naengtureat.inventory.dto.ResponseMapDTO;
import com.shinhan.naengtureat.inventory.entity.Inventory;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Slf4j
public class InventoryService {
    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private IngredientService ingredientService;

    private final LocalDate nowDate = LocalDate.now();

    private final ModelMapper mapper = new ModelMapper();
    @Autowired
    private IngredientRepository ingredientRepository;


    public InventoryResponseDTO getInventoryById(Long inventoryId) {
        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new NoSuchElementException("재료가 없습니다."));

        //entity -> DTO
        InventoryResponseDTO inventoryResponseDTO = convertDto(inventory);

        //남은 기간 계산 및 저장
        setCalculateDday(inventoryResponseDTO);

        //재료 조회
        IngredientDTO ingredientDTO = ingredientService.getStandardIngredientById(inventoryResponseDTO.getIngredientId());

        //재료 이름 저장
        inventoryResponseDTO.setIngredientName(ingredientDTO.getSmallCategory());
        return inventoryResponseDTO;
    }

    public List<InventoryResponseDTO> getAllInventory(Long memberId) {
        List<Inventory> inventoryList = inventoryRepository.findAllByMemberId(memberId);

        return inventoryList.stream().map((inventory) -> {
            InventoryResponseDTO inventoryResponseDTO = convertDto(inventory);

            //남은 기간 계산 및 저장
            setCalculateDday(inventoryResponseDTO);

            //재료 조회
            IngredientDTO ingredientDTO = ingredientService.getStandardIngredientById(inventoryResponseDTO.getIngredientId());

            //재료 이름 저장
            inventoryResponseDTO.setIngredientName(ingredientDTO.getSmallCategory());
            return inventoryResponseDTO;
        }).toList();
    }

    private void setCalculateDday (InventoryResponseDTO inventoryResponseDTO) {
        int remainingDays = (int) ChronoUnit.DAYS.between(nowDate, inventoryResponseDTO.getInventoryExpDate());
        inventoryResponseDTO.setRemainingDays(remainingDays);
    }


    @Transactional
    public ResponseMapDTO createInventory(InventoryRequestDTO inventoryRequestDTO) {
        if (inventoryRequestDTO.getQuantity() <= 0) {
            throw new IllegalArgumentException("재료 수량은 0이상 이여야 합니다.");
        }
        // 유효성 검사를 위해 재료 검색
        IngredientDTO ingredientDTO = ingredientService.getStandardIngredientById(inventoryRequestDTO.getIngredientId());

        Inventory inventory = convertEntity(inventoryRequestDTO);

        inventory.setIngredient(ingredientRepository.findById(ingredientDTO.getId())
                .orElseThrow(() -> new NoSuchElementException("재료를 찾을 수 없습니다.")));  // 유효한 재료 등록

        inventoryRepository.save(inventory);
        return ResponseMapDTO.builder()
                .message("재료 저장이 완료되었습니다")
                .build();
    }

    @Transactional
    public ResponseMapDTO updateInventory(InventoryRequestDTO inventoryRequestDTO) {
        if (inventoryRequestDTO.getQuantity() <= 0) {
            throw new IllegalArgumentException("재료 수량은 0 이상 이여야 합니다.");
        }
        // 기존 재고 조회
        Inventory inventory = inventoryRepository.findById(inventoryRequestDTO.getId())
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 재료 입니다."));

        //재료 검증
        IngredientDTO ingredientDTO = ingredientService.getStandardIngredientById(inventoryRequestDTO.getIngredientId());

        inventory.setQuantity(inventoryRequestDTO.getQuantity());  //변경된 수량 등록
        inventory.setNickName(inventoryRequestDTO.getNickName());  //변경된 닉네임 등록
        inventory.setMemo(inventoryRequestDTO.getMemo());  //변경된 메모 등록
        inventory.setInventoryExpDate(inventoryRequestDTO.getInventoryExpDate());  //변경된 유효기간 등록
        inventory.setInputDate(inventoryRequestDTO.getInputDate());  //변경된 인입일 등록
        inventory.setIngredient(ingredientRepository.findById(ingredientDTO.getId())
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 재료 입니다.")));  // 유효한 재료 등록

        return ResponseMapDTO.builder()
                .message("재료 수정이 완료 되었습니다.")
                .build();
    }

    public List<InventoryResponseDTO> searchInventoryByKeyword(String keyword) {
        Predicate predicate = inventoryRepository.searchInventoryByKeyword(keyword);
        List<Inventory> inventoryList = (List<Inventory>) inventoryRepository.findAll(predicate);

        return convertDtoList(inventoryList);
    }

    @Transactional
    public List<InventoryResponseDTO> getInventoriesByKeywordsCategory(List<String> keywords, Long memberId) {
        Predicate predicate = inventoryRepository.searchInventoryByBigCategories(keywords, memberId);
        List<Inventory> inventoryList = (List<Inventory>) inventoryRepository.findAll(predicate);

        return convertDtoList(inventoryList);
    }

    public List<InventoryResponseDTO> getExpiredInventory(Long memberId) {
        return inventoryRepository.findAllByMemberId(memberId).stream()
                .map(inventory -> {
                    InventoryResponseDTO inventoryResponseDTO = convertDto(inventory);

                    //남은 기간 계산 및 저장
                    setCalculateDday(inventoryResponseDTO);

                    //재료 조회
                    IngredientDTO ingredientDTO = ingredientService.getStandardIngredientById(inventoryResponseDTO.getIngredientId());

                    //재료 이름 저장
                    inventoryResponseDTO.setIngredientName(ingredientDTO.getSmallCategory());
                    return inventoryResponseDTO;
                })
                .filter(inventoryResponseDTO -> inventoryResponseDTO.getRemainingDays() < 0)
                .toList();
    }

    public InventoryResponseDTO convertDto(Inventory inventory) {
        return mapper.map(inventory, InventoryResponseDTO.class);
    }

    public List<InventoryResponseDTO> convertDtoList(List<Inventory> inventoryList) {
        return inventoryList.stream()
                .map((inventory) -> {
                    IngredientDTO ingredientDTO = ingredientService.getStandardIngredientById(inventory.getIngredient().getId());

                    InventoryResponseDTO inventoryResponseDTO = convertDto(inventory);
                    setCalculateDday(inventoryResponseDTO);
                    inventoryResponseDTO.setIngredientName(ingredientDTO.getSmallCategory());
                    return inventoryResponseDTO;
                })
                .collect(Collectors.toList());
    }

    public Inventory convertEntity(InventoryRequestDTO inventoryRequestDTO) {
        return mapper.map(inventoryRequestDTO, Inventory.class);
    }

    public List<IngredientComparisonDTO> getListNotEnoughIngredient(Long memberId,LocalDate startDate, LocalDate endDate) {
    	//날짜 두개를 입력 받고 , 그 사이에 있는 식단(레시피)를 조회
    	List<Object[]> results = inventoryRepository.compareInventoryWithMealPlan(memberId,startDate,endDate);
    	 return results.stream()
                 .map(row -> new IngredientComparisonDTO(
                         row[0] != null ? ((Number) row[0]).longValue() : null, // memberIngredientId 사용자가 가지고 있는 재료 ID (nullable)
                         row[1] != null ? ((Number) row[1]).intValue() : 0, // memberQuantity 사용자가 보유한 재료 개수 (nullable, default 0)
                         (String) row[2], // b_name 재료 카테고리명
                         ((Number) row[3]).longValue(), // mealPlanIngredientId  필요한 재료 ID
                         ((Number) row[4]).intValue(),  // mealPlanQuantity 필요한 재료 개수
                         (String) row[5], // b_recipe_name 레시피명
                         (String) row[6],// 인벤토리 단위
                        (String) row[7]//이미지 경로
                		 ))
                 .collect(Collectors.toList());
    }
}
