package restaurant.nf.project_restaurant.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "categories")
@Data
public class Category {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String city;
}
