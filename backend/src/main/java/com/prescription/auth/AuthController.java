package com.prescription.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        User user = new User();
        user.setName(request.getName());
        user.setAge(request.getAge());
        user.setGender(request.getGender());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        User savedUser = authService.registerUser(user);
        String token = jwtUtil.generateToken(savedUser.getEmail());
        return ResponseEntity.ok().body(token);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = authService.authenticate(request.getEmail(), request.getPassword());
        if (user == null) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok().body(token);
    }
}
