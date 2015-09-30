import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as movieActions from 'redux/modules/movies';
import {isLoaded, load as loadMovies} from 'redux/modules/movies';
import { Tabs, Tab, Modal, Button, Row, Col } from 'react-bootstrap';
import { MovieForm } from 'components';

@connect(
  state => ({
    movies: state.movies.data
  }),
  dispatch => ({
    ...bindActionCreators({ ...movieActions }, dispatch)
  })
)
export default
class Movies extends Component {
  static propTypes = {
    movies: PropTypes.array,
    loading: PropTypes.bool,
    load: PropTypes.func.isRequired,
    error: PropTypes.string
  }

  state = {
    showModal: false
  }

  static fetchData(store) {
    if (!isLoaded(store.getState())) {
      return store.dispatch(loadMovies());
    }
  }

  handleSubmit(data) {
    window.alert('Data submitted! ' + JSON.stringify(data));
  }

  showMovieForm() {
    this.setState({showModal: true});
  }

  hideMovieForm() {
    this.setState({ showModal: false });
  }

  render() {
    const { movies, error, loading, load } = this.props;
    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }
    const styles = require('./Movies.scss');
    const movieDialog = () => (
      <Modal show={this.state.showModal} onHide={::this.hideMovieForm}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MovieForm/>
        </Modal.Body>
        <Modal.Footer>
          <Row className="form-group">
            <Col sm={6} smOffset={2}>
              <Button bsStyle="success" onClick={::this.hideMovieForm}>
                <i className="fa fa-paper-plane"/> Submit
              </Button>
              <Button bsStyle="warning" style={{marginLeft: 15}}>
                <i className="fa fa-undo"/> Reset
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    );
    const errorBlock = () => (
      error &&
      <div className="alert alert-danger" role="alert">
        <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
        {' '}
        {error}
      </div>
    );

    return (
      <div className={styles.movies + ' container'}>
        <h1>
          Movies
          <button className={styles.refreshBtn + ' btn btn-success'} onClick={load}><i
            className={refreshClassName}/> {' '} Reload movies
          </button>
        </h1>

        <Tabs defaultActiveKey={1}>
          <Tab eventKey={1} title="Assets">
            <Button bsStyle="primary" onClick={::this.showMovieForm}>
              Create/Edit movie
            </Button>
            { movieDialog() }
            { errorBlock() }
            { movies && movies.length && movies.map((m) => (<div key={m.id}>{m.id}</div>))}
          </Tab>
          <Tab eventKey={2} title="Directors">Directors</Tab>
        </Tabs>
      </div>
    );
  }
}

