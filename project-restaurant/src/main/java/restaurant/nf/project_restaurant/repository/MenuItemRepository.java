package restaurant.nf.project_restaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import restaurant.nf.project_restaurant.model.MenuItem;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByRestaurantId(String restaurantId);
}
