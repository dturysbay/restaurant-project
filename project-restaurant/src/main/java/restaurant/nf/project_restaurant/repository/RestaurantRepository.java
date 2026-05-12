package restaurant.nf.project_restaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import restaurant.nf.project_restaurant.model.Restaurant;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, String> {

    @Query("SELECT r FROM Restaurant r WHERE LOWER(r.cuisineTags) LIKE LOWER(CONCAT('%', :tag, '%'))")
    List<Restaurant> findByCuisineTag(@Param("tag") String tag);
}
