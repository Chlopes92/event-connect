package co.simplon.cda.event_connect_backend.dtos.category;

/**
 * DTO pour la représentation d'une catégorie
 *
 * Utilisé pour :
 * - Afficher la liste des catégories (filtres sur la page d'accueil)
 * - Inclure les catégories dans EventViewDTO
 *
 * Record Java (immutable) : génère automatiquement :
 * - Constructeur avec tous les champs
 * - Getters (id(), nameCategory())
 * - equals(), hashCode(), toString()
 */
public record CategoryDTO(
        Integer id,
        String nameCategory
) {
    @Override
    public String toString() {
        return "Category [categoryName= " + nameCategory + "]";
    }
}
