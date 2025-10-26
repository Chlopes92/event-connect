package co.simplon.cda.event_connect_backend.dtos.category;

public record CategoryDTO(
        Integer id,
        String nameCategory
) {
    @Override
    public String toString() {
        return "Category [categoryName= " + nameCategory + "]";
    }
}
