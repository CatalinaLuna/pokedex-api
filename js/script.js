// Búsqueda con Enter
document.getElementById('search').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        fetchPokemon();
    }
});

// Manejar el cambio de tamaño de la ventana
window.addEventListener('resize', function() {
    if (window.innerWidth >= 768) {
        document.querySelector('.container').style.transform = 'scale(1.1)';
    } else {
        document.querySelector('.container').style.transform = 'scale(1)';
    }
});

async function fetchPokemon() {
    const name = document.getElementById("search").value.toLowerCase().trim();
    if (!name) return;
    
    // Mostrar estado de carga con tamaño fijo
    document.getElementById("pokemon-container").innerHTML = `
        <div class='pokemon-card'>
            <div class="pokemon-header">
                <span class="pokemon-name">CARGANDO...</span>
            </div>
            <div class="pokemon-image-container">
                <img class="pokemon-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png">
            </div>
            <div class="pokemon-details">
                <div class="detail-item">
                    <div class="detail-label">ALTURA</div>
                    <div>---</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">PESO</div>
                    <div>---</div>
                </div>
            </div>
        </div>
    `;
    
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) throw new Error("Pokémon no encontrado");
        
        const data = await response.json();
        
        // Obtener tipos
        const typeBadges = data.types.map(type => 
            `<span class="type-badge type-${type.type.name}">${type.type.name.toUpperCase()}</span>`
        ).join('');
        
        // Formatear número con 3 dígitos
        const paddedId = data.id.toString().padStart(3, '0');
        
        // Usar sprite animado si está disponible, sino el normal
        const spriteUrl = data.sprites.versions['generation-v']['black-white'].animated?.front_default || 
                         data.sprites.other['official-artwork'].front_default ||
                         data.sprites.front_default;
        
        document.getElementById("pokemon-container").innerHTML = `
            <div class='pokemon-card'>
                <div class="pokemon-header">
                    <span class="pokemon-name">${data.name.toUpperCase()}</span>
                    <span class="pokemon-number">N°${paddedId}</span>
                </div>
                <div class="pokemon-image-container">
                    <img class="pokemon-image" src="${spriteUrl}" alt="${data.name}">
                </div>
                <div class="pokemon-details">
                    <div class="detail-item">
                        <div class="detail-label">ALTURA</div>
                        <div>${(data.height / 10).toFixed(1)} m</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">PESO</div>
                        <div>${(data.weight / 10).toFixed(1)} kg</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">TIPO</div>
                        <div>${typeBadges}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">EXP</div>
                        <div>${data.base_experience || '---'}</div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        document.getElementById("pokemon-container").innerHTML = `
            <div class='pokemon-card'>
                <div class="pokemon-header">
                    <span class="pokemon-name">ERROR</span>
                </div>
                <div class="pokemon-image-container">
                    <img class="error-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png" alt="MissingNo">
                </div>
                <div class="error-message">POKÉMON NO ENCONTRADO</div>
                <div class="pokemon-details">
                    <div class="detail-item">
                        <div class="detail-label">SOLUCIÓN</div>
                        <div>REVISA EL NOMBRE</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">EJEMPLOS</div>
                        <div>pikachu, 25</div>
                    </div>
                </div>
            </div>
        `;
    }
}
