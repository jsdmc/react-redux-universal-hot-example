import React, {Component, PropTypes} from 'react';
import {connectReduxForm} from 'redux-form';
import {connect} from 'react-redux';
import  { Grid, Row, Col }  from 'react-bootstrap';

@connect(
  state => ({
    saveError: state.movies.saveError
  }))
@connectReduxForm({
  form: 'movie',
  fields: ['title', 'type', 'startDate']
})
export default
class SurveyForm extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    saveError: PropTypes.object
  }

  render() {
    const {
      fields: { title },
      handleSubmit,
      saveError
    } = this.props;
    const styles = require('./MovieForm.scss');
    const renderInput = (field, label) =>
      <Row className={'form-group' + (field.error && field.touched ? ' has-error' : '')}>
        <Col sm={2}>
          <label htmlFor={field.name}>{label}</label>
        </Col>
        <Col sm={4} className={styles.inputGroup}>
          <input type="text" className="form-control" id={field.name} {...field}/>
          {field.error && field.touched && <div className="text-danger">{field.error}</div>}
        </Col>
      </Row>;

    return (
      <Grid className={styles.movieForm}>
        <form className="form-horizontal" onSubmit={handleSubmit}>
          {renderInput(title, 'Title')}
        </form>
        {saveError && <div className="text-danger">{saveError}</div>}
      </Grid>
    );
  }
}


