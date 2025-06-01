import { supabase } from '../../util/supabase'

export default async function GetVideogames() {
    // Categorias videojuegos: 1-Terror, 2-Fantasia, 3-Accion, 4-Puzzles, 5-Simulación, 6-Deportes y carreras, 7-Lucha

    const {data:videogames} = await supabase.from('videogame').select()
    console.log(videogames)
    
    return videogames;
}
