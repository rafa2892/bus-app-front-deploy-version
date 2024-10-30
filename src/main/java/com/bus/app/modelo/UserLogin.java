package com.bus.app.modelo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "usuario")
@Getter
@Setter
public class UserLogin {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "usuario", nullable = false)
    private String usu;

    @Column(name = "rol", nullable = false)
    private String rol;

    @Column(name = "pass", nullable = false)
    private String pass;
}