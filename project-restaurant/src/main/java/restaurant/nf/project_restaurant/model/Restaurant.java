package restaurant.nf.project_restaurant.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "restaurants")
@Data
public class Restaurant {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String city;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "cuisine_tags")
    private String cuisineTags;

    @Column(name = "rating_score")
    private Double ratingScore;

    @Column(name = "rating_count")
    private Integer ratingCount;

    @Column(name = "delivery_time_min")
    private Integer deliveryTimeMin;

    private Double longitude;
    private Double latitude;
    private String slug;

    @Column(name = "wolt_url", columnDefinition = "TEXT")
    private String woltUrl;

    @JsonIgnore
    @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY)
    private List<MenuItem> menuItems;
}
