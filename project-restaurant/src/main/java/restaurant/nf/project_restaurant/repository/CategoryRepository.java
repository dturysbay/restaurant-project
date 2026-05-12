package restaurant.nf.project_restaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import restaurant.nf.project_restaurant.model.Category;

public interface CategoryRepository extends JpaRepository<Category, String> {
}
