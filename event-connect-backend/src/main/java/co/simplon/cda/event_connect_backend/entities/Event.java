package co.simplon.cda.event_connect_backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "t_events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Integer id;

    @NotBlank(message = "Le nom de l'événement est obligatoire")
    @Size(max = 50, message = "Le nom ne doit pas dépasser 50 caractères")
    @Column(name = "name_event")
    private String nameEvent;

    @Size(max = 255, message = "L'URL de l'image ne doit pas dépasser 255 caractères")
    @Column(name = "img_url")
    private String imgUrl;

    @NotBlank(message = "La description est obligatoire")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "La date de l'événement est obligatoire")
    @FutureOrPresent(message = "La date doit être aujourd'hui ou dans le futur")
    @Column(name = "date_event")
    private LocalDate dateEvent;

    @NotBlank(message = "Le programme est obligatoire")
    @Column(name = "program", columnDefinition = "TEXT")
    private String program;

    @NotBlank(message = "Le contact est obligatoire")
    @Column(name = "contact")
    private String contact;

    @DecimalMin(value = "0.0", inclusive = true, message = "Le prix ne peut pas être négatif")
    @Digits(integer = 13, fraction = 2, message = "Format de prix invalide")
    @Column(name = "price", precision = 15, scale = 2)
    private BigDecimal price;

    @Min(value = 0, message = "Le nombre de places ne peut pas être négatif")
    @Column(name = "number_place")
    private Integer numberPlace;

    @NotBlank(message = "L'adresse est obligatoire")
    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @NotNull(message = "La catégorie est obligatoire")
    @ManyToMany
    @JoinTable(
            name = "t_belong",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories = new ArrayList<>();

    /* @ManyToOne
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @ManyToMany
    @JoinTable(
            name = "t_register",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "profile_id")
    )
    private List<Profile> registeredProfiles = new ArrayList<>(); */

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNameEvent() {
        return nameEvent;
    }

    public void setNameEvent(String nameEvent) {
        this.nameEvent = nameEvent;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public LocalDate getDateEvent() {
        return dateEvent;
    }

    public void setDateEvent(LocalDate dateEvent) {
        this.dateEvent = dateEvent;
    }

    public String getProgram() {
        return program;
    }

    public void setProgram(String program) {
        this.program = program;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getNumberPlace() {
        return numberPlace;
    }

    public void setNumberPlace(Integer numberPlace) {
        this.numberPlace = numberPlace;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

   /* public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    public List<Profile> getRegisteredProfiles() {
        return registeredProfiles;
    }

    public void setRegisteredProfiles(List<Profile> registeredProfiles) {
        this.registeredProfiles = registeredProfiles;
    }*/
}
