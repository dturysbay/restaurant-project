package restaurant.nf.project_restaurant.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import restaurant.nf.project_restaurant.model.Category;
import restaurant.nf.project_restaurant.model.MenuItem;
import restaurant.nf.project_restaurant.model.Restaurant;
import restaurant.nf.project_restaurant.service.RestaurantService;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RestaurantController.class)
class RestaurantControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RestaurantService restaurantService;

    private Restaurant buildRestaurant(String id, String name, String cuisine) {
        Restaurant r = new Restaurant();
        r.setId(id);
        r.setName(name);
        r.setCity("almaty");
        r.setCuisineTags(cuisine);
        r.setRatingScore(8.2);
        r.setDeliveryTimeMin(30);
        return r;
    }

    @Test
    void getAll_noCuisineParam_returnsAllRestaurants() throws Exception {
        when(restaurantService.getAllRestaurants()).thenReturn(List.of(
                buildRestaurant("1", "POPEYES Abay Plaza", "курица, бургер"),
                buildRestaurant("2", "Базилик Аксай", "пицца, итальянская")
        ));

        mockMvc.perform(get("/api/restaurants"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("POPEYES Abay Plaza")))
                .andExpect(jsonPath("$[1].name", is("Базилик Аксай")));
    }

    @Test
    void getAll_withCuisineParam_returnsFilteredRestaurants() throws Exception {
        when(restaurantService.getRestaurantsByCuisine("пицца")).thenReturn(List.of(
                buildRestaurant("2", "Базилик Аксай", "пицца, итальянская")
        ));

        mockMvc.perform(get("/api/restaurants").param("cuisine", "пицца"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].cuisineTags", containsString("пицца")));

        verify(restaurantService).getRestaurantsByCuisine("пицца");
        verify(restaurantService, never()).getAllRestaurants();
    }

    @Test
    void getAll_emptyResult_returnsEmptyArray() throws Exception {
        when(restaurantService.getAllRestaurants()).thenReturn(List.of());

        mockMvc.perform(get("/api/restaurants"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void getById_existingRestaurant_returns200WithBody() throws Exception {
        Restaurant r = buildRestaurant("abc123", "KFC Saryarka", "курица, фастфуд");
        when(restaurantService.getRestaurantById("abc123")).thenReturn(Optional.of(r));

        mockMvc.perform(get("/api/restaurants/abc123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is("abc123")))
                .andExpect(jsonPath("$.name", is("KFC Saryarka")))
                .andExpect(jsonPath("$.city", is("almaty")));
    }

    @Test
    void getById_unknownId_returns404() throws Exception {
        when(restaurantService.getRestaurantById("nonexistent")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/restaurants/nonexistent"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getMenu_returnsMenuItems() throws Exception {
        MenuItem item = new MenuItem();
        item.setId(1L);
        item.setItemName("Crispy Chicken Burger");
        item.setMenuCategory("Бургеры");
        item.setPriceKzt(2200);
        item.setDescription("Сочный бургер с хрустящей курицей");

        when(restaurantService.getMenuByRestaurantId("abc123")).thenReturn(List.of(item));

        mockMvc.perform(get("/api/restaurants/abc123/menu"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].itemName", is("Crispy Chicken Burger")))
                .andExpect(jsonPath("$[0].priceKzt", is(2200)));
    }

    @Test
    void getMenu_noItems_returnsEmptyArray() throws Exception {
        when(restaurantService.getMenuByRestaurantId("abc123")).thenReturn(List.of());

        mockMvc.perform(get("/api/restaurants/abc123/menu"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void getCategories_returnsAllCategories() throws Exception {
        Category cat1 = new Category();
        cat1.setId("burgers");
        cat1.setName("Бургер");
        cat1.setCity("almaty");

        Category cat2 = new Category();
        cat2.setId("pizza");
        cat2.setName("Пицца");
        cat2.setCity("almaty");

        when(restaurantService.getAllCategories()).thenReturn(List.of(cat1, cat2));

        mockMvc.perform(get("/api/restaurants/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is("burgers")))
                .andExpect(jsonPath("$[1].name", is("Пицца")));
    }
}
