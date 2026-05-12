package restaurant.nf.project_restaurant.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import restaurant.nf.project_restaurant.dto.ChatMessage;
import restaurant.nf.project_restaurant.model.Restaurant;
import restaurant.nf.project_restaurant.repository.RestaurantRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiChatService {

    private final WebClient.Builder webClientBuilder;
    private final RestaurantRepository restaurantRepository;

    @Value("${anthropic.api.key}")
    private String apiKey;

    @Value("${anthropic.api.url}")
    private String apiUrl;

    @Value("${anthropic.model}")
    private String model;

    public String chat(List<ChatMessage> messages) {
        String systemPrompt = buildSystemPrompt();

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("max_tokens", 1024);
        body.put("system", systemPrompt);
        body.put("messages", messages.stream()
                .map(m -> Map.of("role", m.getRole(), "content", m.getContent()))
                .collect(Collectors.toList()));

        Map<?, ?> response = webClientBuilder.build()
                .post()
                .uri(apiUrl)
                .header("x-api-key", apiKey)
                .header("anthropic-version", "2023-06-01")
                .header("content-type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        List<?> content = (List<?>) response.get("content");
        Map<?, ?> first = (Map<?, ?>) content.get(0);
        return (String) first.get("text");
    }

    private String buildSystemPrompt() {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        String restaurantList = restaurants.stream()
                .map(r -> String.format("- %s (%s): рейтинг %.1f, доставка %d мин, адрес: %s",
                        r.getName(),
                        r.getCuisineTags() != null ? r.getCuisineTags() : "разная кухня",
                        r.getRatingScore() != null ? r.getRatingScore() : 0.0,
                        r.getDeliveryTimeMin() != null ? r.getDeliveryTimeMin() : 30,
                        r.getAddress() != null ? r.getAddress() : "Алматы"))
                .collect(Collectors.joining("\n"));

        return """
                You are a friendly restaurant assistant for a food delivery platform in Almaty, Kazakhstan.
                Help users choose restaurants and dishes based on their preferences, budget, and cuisine type.
                Be concise, warm, and helpful. Respond in the same language the user writes in (Russian or English).
                Prices are in KZT (Kazakhstani tenge). 1 USD ≈ 450 KZT.

                Available restaurants in Almaty:
                """ + restaurantList;
    }
}
