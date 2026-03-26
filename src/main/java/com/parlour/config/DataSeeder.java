package com.parlour.config;

import com.parlour.model.Service;
import com.parlour.model.SlotConfiguration;
import com.parlour.model.User;
import com.parlour.repository.ServiceRepository;
import com.parlour.repository.SlotConfigRepository;
import com.parlour.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final SlotConfigRepository slotConfigRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedSlotConfig();
        seedServices();
    }

    private void seedAdmin() {
        if (userRepository.findByEmail("admin@parlour.com").isEmpty()) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@parlour.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Default admin user created: admin@parlour.com");
        }
    }

    private void seedSlotConfig() {
        if (slotConfigRepository.count() == 0) {
            SlotConfiguration config = SlotConfiguration.builder()
                    .startTime("09:00")
                    .endTime("21:00")
                    .bufferMinutes(5)
                    .workingDays(Arrays.asList(1, 2, 3, 4, 5, 6, 7)) // Mon-Sun
                    .build();
            slotConfigRepository.save(config);
            log.info("Default slot configuration created: 09:00-21:00, 5min buffer, Mon-Sun");
        }
    }

    private void seedServices() {
        if (serviceRepository.count() == 0) {
            List<Service> services = Arrays.asList(
                // Hair Services
                Service.builder().name("Normal Haircut").description("Classic precision haircut with wash and styling. Clean, sharp, and professional.").category("Hair Services").price(150.0).duration(30).active(true).build(),
                Service.builder().name("Fade / Stylish Cut").description("Trendy fade or stylish haircut tailored to your look. Includes wash and finish.").category("Hair Services").price(160.0).duration(40).active(true).build(),
                Service.builder().name("Hair Colouring").description("Premium hair colouring with quality products. Includes consultation and styling.").category("Hair Services").price(300.0).duration(60).active(true).build(),

                // Beard & Shavings
                Service.builder().name("Beard Trim").description("Expert beard trimming and shaping for a clean, well-groomed look.").category("Beard & Shavings").price(50.0).duration(15).active(true).build(),
                Service.builder().name("Clean Shave").description("Smooth and precise clean shave with hot towel finish for ultimate freshness.").category("Beard & Shavings").price(50.0).duration(20).active(true).build(),

                // Facial & Treatments
                Service.builder().name("Basic Facial").description("Refreshing basic facial with deep cleansing, exfoliation, and hydrating mask.").category("Facial & Treatments").price(300.0).duration(45).active(true).build(),
                Service.builder().name("DE-Tan Treatment").description("Specialized de-tan treatment to remove sun damage and restore natural skin tone.").category("Facial & Treatments").price(350.0).duration(40).active(true).build(),
                Service.builder().name("Premium Facial").description("Luxurious premium facial with advanced serums, massage, and rejuvenating mask.").category("Facial & Treatments").price(600.0).duration(60).active(true).build(),

                // Special Services
                Service.builder().name("Kids Haircut").description("Fun and gentle haircut for kids in a comfortable, friendly environment.").category("Special Services").price(100.0).duration(20).active(true).build()
            );
            serviceRepository.saveAll(services);
            log.info("Seeded {} services for TIME SHAVING", services.size());
        }
    }
}
