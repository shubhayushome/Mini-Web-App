package org.example.app;

import org.example.Summarizer;
import org.springframework.web.bind.annotation.*;

@RestController
public class SummaryController {
    @GetMapping("/summarize")
    public String summarize(@RequestParam String text) {
        return Summarizer.summarize(text);
    }
}
