package restaurant.nf.project_restaurant.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import restaurant.nf.project_restaurant.model.Category;
import restaurant.nf.project_restaurant.model.MenuItem;
import restaurant.nf.project_restaurant.model.Restaurant;
import restaurant.nf.project_restaurant.repository.CategoryRepository;
import restaurant.nf.project_restaurant.repository.MenuItemRepository;
import restaurant.nf.project_restaurant.repository.RestaurantRepository;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RestaurantServiceTest {

    @Mock private RestaurantRepository restaurantRepository;
    @Mock private MenuItemRepository menuItemRepository;
    @Mock private CategoryRepository categoryRepository;

    @InjectMocks
    private RestaurantService service;

    private Restaurant sampleRestaurant;

    @BeforeEach
    void setUp() {
        sampleRestaurant = new Restaurant();
        sampleRestaurant.setId("abc123");
        sampleRestaurant.setName("POPEYES Abay Plaza");
        sampleRestaurant.setCity("almaty");
        sampleRestaurant.setCuisineTags("курица, бургер, халяль");
        sampleRestaurant.setRatingScore(8.2);
        sampleRestaurant.setDeliveryTimeMin(30);
    }

    @Test
    void getAllRestaurants_returnsAllFromRepository() {
        when(restaurantRepository.findAll()).thenReturn(List.of(sampleRestaurant));

        List<Restaurant> result = service.getAllRestaurants();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("POPEYES Abay Plaza");
        verify(restaurantRepository, times(1)).findAll();
    }

    @Test
    void getAllRestaurants_emptyDb_returnsEmptyList() {
        when(restaurantRepository.findAll()).thenReturn(List.of());

        List<Restaurant> result = service.getAllRestaurants();

        assertThat(result).isEmpty();
    }

    @Test
    void getRestaurantById_existingId_returnsRestaurant() {
        when(restaurantRepository.findById("abc123")).thenReturn(Optional.of(sampleRestaurant));

        Optional<Restaurant> result = service.getRestaurantById("abc123");

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo("abc123");
    }

    @Test
    void getRestaurantById_unknownId_returnsEmpty() {
        when(restaurantRepository.findById("unknown")).thenReturn(Optional.empty());

        Optional<Restaurant> result = service.getRestaurantById("unknown");

        assertThat(result).isEmpty();
    }

    @Test
    void getRestaurantsByCuisine_matchingTag_returnsFilteredList() {
        when(restaurantRepository.findByCuisineTag("бургер")).thenReturn(List.of(sampleRestaurant));

        List<Restaurant> result = service.getRestaurantsByCuisine("бургер");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCuisineTags()).contains("бургер");
    }

    @Test
    void getRestaurantsByCuisine_noMatch_returnsEmptyList() {
        when(restaurantRepository.findByCuisineTag("french")).thenReturn(List.of());

        List<Restaurant> result = service.getRestaurantsByCuisine("french");

        assertThat(result).isEmpty();
    }

    @Test
    void getMenuByRestaurantId_returnsMenuItems() {
        MenuItem item = new MenuItem();
        item.setId(1L);
        item.setItemName("Crispy Chicken Burger");
        item.setPriceKzt(2200);

        when(menuItemRepository.findByRestaurantId("abc123")).thenReturn(List.of(item));

        List<MenuItem> menu = service.getMenuByRestaurantId("abc123");

        assertThat(menu).hasSize(1);
        assertThat(menu.get(0).getItemName()).isEqualTo("Crispy Chicken Burger");
    }

    @Test
    void getMenuByRestaurantId_noItems_returnsEmptyList() {
        when(menuItemRepository.findByRestaurantId("abc123")).thenReturn(List.of());

        List<MenuItem> menu = service.getMenuByRestaurantId("abc123");

        assertThat(menu).isEmpty();
    }

    @Test
    void getAllCategories_returnsAllCategories() {
        Category cat = new Category();
        cat.setName("Бургер");

        when(categoryRepository.findAll()).thenReturn(List.of(cat));

        List<Category> result = service.getAllCategories();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Бургер");
    }
}
