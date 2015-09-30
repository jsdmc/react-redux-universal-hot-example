const initialMovies = [
  {id: 1, title: 'Red', sprocketCount: 7, owner: 'John'},
  {id: 2, title: 'Taupe', sprocketCount: 1, owner: 'George'},
  {id: 3, title: 'Green', sprocketCount: 8, owner: 'Ringo'},
  {id: 4, title: 'Blue', sprocketCount: 2, owner: 'Paul'}
];

const getMovies = (req, res) => {
  let movies = req.session.movies;
  if (!movies) {
    movies = initialMovies;
    req.session.movies = movies;
  }
  return movies;
}

const getMovieFromRequest = (req) => {
	var body = req.body;
	return {
		'id':					body.id,
		'title':			body.title,
		'startDate':	new Date(Date.parse(body.startDate))
	};
};

//----------GET ALL
export function getAll(req, res){
 	console.info('----\n==> LOAD MOVIES');
  return new Promise((resolve, reject) => {
    // make async call to database
    setTimeout(() => {
      if (Math.floor(Math.random() * 3) === 0) {
        reject('Movies load fails 33% of the time. You were unlucky.');
      } else {
        resolve(getMovies(req));
      }
    }, 1000); // simulate async load
  });
}

//----------GET ONE BY ID
export function getById(req, res){
	const { params: id } = req;
	let movie = getMovies(req, res)[id-1];

	res.json(movie) ;
}

//----------CREATE 
export function create(req, res){
	let movie = getMovieFromRequest(req);
	//get new Id
	movie.id = Math.max(widgets.map((el) => el.id))+1;
	req.session.movies.push(movie);
	res.json(movie);
}

//----------UPDATE
export function update(req, res){
	const { params: id } = req;
	let movieUpdated = getMovieFromRequest(req);

	new Promise((resolve, reject) => {
    // write to database or so
    setTimeout(() => {
      if (Math.floor(Math.random() * 5) === 0) {
        reject('Oh no! movie save fails 20% of the time. Try again.');
      } else {
				// example server-side validation error
        if (widget.color === 'Green') {
          reject({
            color: 'We do not accept green widgets' 
          });
        }
        let index = id - 1;
				if (index > -1){
					//update
					getMovies(req, res)[id-1] = movieUpdated;
				}
				//success update
        resolve(widget);
      }
    }, 2000); // simulate async db write
  }).then(
  	// successs
  	(result) => {
    	res.sendStatus(200)
  	}, 
  	// fail
  	(reason) => {
    	if (reason && reason.redirect) {
      	res.redirect(reason.redirect);
    	} else {
      	console.error('API ERROR:', pretty.render(reason));
      	res.status(reason.status || 500).json(reason);
    	}
  	}
  );
}

//----------DELETE BY ID
export function deleteById(req, res){
	const { params: id } = req;
	//id of items is 1based
	let index = id - 1;
	if (index > -1){
		getMovies(req, res).splice(index, 1);
	}
	res.sendStatus(200)
}

//----------DELETE ALL
export function deleteAll(req, res){
	req.session.movies = []
	res.sendStatus(200)
}