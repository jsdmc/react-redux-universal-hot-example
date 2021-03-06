import React from 'react';
import {Route} from 'react-router';
import {
    App,
    Chat,
    Home,
    Movies,
    Widgets,
    About,
    Login,
    RequireLogin,
    LoginSuccess,
    Survey,
    NotFound,
  } from 'containers';

export default function(history) {
  return (
    <Route component={App} history={history}>
      <Route path="/" component={Home}/>
      <Route path="/movies" component={Movies}/>
      <Route path="/widgets" component={Widgets}/>
      <Route path="/about" component={About}/>
      <Route path="/login" component={Login}/>
      <Route component={RequireLogin}>
        <Route path="/chat" component={Chat}/>
        <Route path="/loginSuccess" component={LoginSuccess}/>
      </Route>
      <Route path="/survey" component={Survey}/>
      <Route path="*" component={NotFound}/>
    </Route>
  );
}
