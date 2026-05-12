package restaurant.nf.project_restaurant.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import restaurant.nf.project_restaurant.dto.ChatRequest;
import restaurant.nf.project_restaurant.dto.ChatResponse;
import restaurant.nf.project_restaurant.service.AiChatService;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final AiChatService aiChatService;

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {
        String reply = aiChatService.chat(request.getMessages());
        return new ChatResponse(reply);
    }
}
