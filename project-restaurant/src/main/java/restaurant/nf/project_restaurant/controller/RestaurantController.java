package restaurant.nf.project_restaurant.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import restaurant.nf.project_restaurant.model.Category;
import restaurant.nf.project_restaurant.model.MenuItem;
import restaurant.nf.project_restaurant.model.Restaurant;
import restaurant.nf.project_restaurant.service.RestaurantService;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    public List<Restaurant> getAllRestaurants(@RequestParam(required = false) String cuisine) {
        if (cuisine != null && !cuisine.isBlank()) {
            return restaurantService.getRestaurantsByCuisine(cuisine);
        }
        return restaurantService.getAllRestaurants();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable String id) {
        return restaurantService.getRestaurantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/menu")
    public List<MenuItem> getMenu(@PathVariable String id) {
        return restaurantService.getMenuByRestaurantId(id);
    }

    @GetMapping("/categories")
    public List<Category> getCategories() {
        return restaurantService.getAllCategories();
    }
}
