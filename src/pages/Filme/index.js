import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../../services/api';
import './filme.css';

function Home() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [filme, setFilme] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFilme() {
            await api.get(`/movie/${id}`, {
                params: {
                    api_key: '4e37c236782fc55d645f1fd95f8419fe',
                    language: 'pt-BR',
                }
            })
            .then((response)=> {
                setFilme(response.data);
                setLoading(false);
            })
            .catch(()=> {
                navigate('/', { replace: true });
                return;
            })
        }

        loadFilme();
    }, [id, navigate])

    function salvarFilme() {
        const minhaLista = localStorage.getItem('@primeflix');

        let filmesSalvos = JSON.parse(minhaLista) || [];

        const hasFilme = filmesSalvos.some( (filmeSalvo)=> filmeSalvo.id === filme.id) 

        if (hasFilme) {
            toast.warn('Esse filme já está na sua lista!')
            return;
        } else {
            filmesSalvos.push(filme);
            localStorage.setItem("@primeflix", JSON.stringify(filmesSalvos));
            toast.success('Filme salvo com sucesso!')
        }
    }

    if (loading) {
        return (
            <div className='filme-info'>
                <h1>Carregando detalhes...</h1>
            </div>
        )
    } else {
        return (
            <div className='filme-info'>
                <h1>{filme.title}</h1>
                <img src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`} alt={filme.title}/>
                <h3>Sinopse</h3>
                <span>{filme.overview}</span>
                <strong>Avaliação: {filme.vote_average} / 10</strong>
                <div className='area-buttons'>
                    <button onClick={salvarFilme}>Salvar</button>
                    <button>
                        <a target='blank' rel="external noreferrer" href={`https://www.youtube.com/results?search_query=${filme.title} Trailer`}>Trailer</a>
                    </button>
                </div>
            </div>
        )
    }

}

export default Home;