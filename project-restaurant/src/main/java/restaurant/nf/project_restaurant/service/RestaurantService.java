package restaurant.nf.project_restaurant.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import restaurant.nf.project_restaurant.model.Category;
import restaurant.nf.project_restaurant.model.MenuItem;
import restaurant.nf.project_restaurant.model.Restaurant;
import restaurant.nf.project_restaurant.repository.CategoryRepository;
import restaurant.nf.project_restaurant.repository.MenuItemRepository;
import restaurant.nf.project_restaurant.repository.RestaurantRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final CategoryRepository categoryRepository;

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Optional<Restaurant> getRestaurantById(String id) {
        return restaurantRepository.findById(id);
    }

    public List<Restaurant> getRestaurantsByCuisine(String tag) {
        return restaurantRepository.findByCuisineTag(tag);
    }

    public List<MenuItem> getMenuByRestaurantId(String restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}
