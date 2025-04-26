package org.example.app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
public class SummaryProxyController {

    @Autowired
    private SummaryHistoryRepository repository;

    private final String FASTAPI_URL = "http://fastapi:8001/summarize";

    @PostMapping("/summarize-url")
    public ResponseEntity<String> summarizeUrl(@RequestBody Map<String, String> request) {
        String url = request.get("url");

        System.out.println("Received request with URL: " + url); // Add this log to track incoming request

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(Map.of("url", url), headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    FASTAPI_URL,
                    HttpMethod.POST,
                    entity,
                    String.class);

            // Save to DB
            SummaryHistory history = new SummaryHistory();
            history.setUrl(url);
            history.setSummary(response.getBody());
            history.setCreatedAt(LocalDateTime.now());
            repository.save(history);

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error calling FastAPI service: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public List<SummaryHistory> getAllHistory() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

}
