import React from "react";
import { Redirect } from "react-router";
import Error from "../Error/Error";
import Loading from "../Loading/Loading";
import logo_system from "../../assets/images/usuario-masculino-48.png";
import swal from "sweetalert";
import "./RegisterForm.scss";

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      error: false,
      msgError: {},
      loading: false,
      form: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
      }
    };
  }

  handleOnClickRegister = async () => {
    this.setState({ loading: true });
    if (this.state.form.password === this.state.form.confirmPassword) {
      const query = {
        firstName: this.state.form.firstName,
        lastName: this.state.form.lastName,
        email: this.state.form.email,
        password: this.state.form.password,
        verified: false
      };

      try {
        const options = {};
        options.method = "POST";
        options.body = JSON.stringify(query);
        options.headers = new Headers({
          "Content-Type": "application/json; charset=utf-8"
        });

        const response = await fetch(
          "http://localhost:3001/api/v1/user",
          options
        );
        const value = await response.json();
        console.log(value);
        if (value._id) {
          this.setState({ loading: false, redirect: true });
        } else {
          this.setState({ loading: false, redirect: false });
          swal("Oops!", "Error on register user! ", "error");
        }
      } catch (error) {
        this.setState({ loading: false, error: true, msgError: { ...error } });
        console.log(`Error: ${error}`);
      }
    } else {
      this.setState({ loading: false, redirect: false });
      swal("Oops!", "Password dont match!", "error");
    }
  };

  handleChange = e => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
  };

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    if (this.state.redirect) {
      return <Redirect push to='/' />;
    }
    if (this.state.error) {
      return <Error Error={this.state.error} />;
    }
    return (
      <section className='Login__form'>
        <section className='Login__title'>
          <img className='Login__form--img' alt='login' src={logo_system} />
          <h2 className='Login__form--title'>Registrate</h2>
        </section>
        <form className='Login__form--form'>
          <section className='Login__item'>
            <input
              type='text'
              className='Login__item--input'
              placeholder='Nombres'
              name='firstName'
              onChange={this.handleChange}
              value={this.state.form.firstName}
            />
            <input
              type='text'
              className='Login__item--input'
              placeholder='Apellidos'
              name='lastName'
              onChange={this.handleChange}
              value={this.state.form.lastName}
            />
            <input
              type='text'
              className='Login__item--input'
              placeholder='Email (juan.perez@domain.com)'
              name='email'
              onChange={this.handleChange}
              value={this.state.form.email}
            />
            <input
              type='password'
              className='Login__item--input'
              placeholder='Password'
              name='password'
              onChange={this.handleChange}
              value={this.state.form.password}
            />
            <input
              type='password'
              className='Login__item--input'
              placeholder='Confirm password'
              name='confirmPassword'
              onChange={this.handleChange}
              value={this.state.form.confirmPassword}
            />
          </section>
          <section className='Login__item'>
            <button
              type='button'
              className='Login__button'
              onClick={this.handleOnClickRegister}>
              Save
            </button>
            {/* <div className='Login__action'>
              <Link to='LoginReset'>¿Olvidaste tu contraseña?</Link>
              <p className='Login__link'>
                ¿No tienen cuenta? <Link to='siging'>Registrate!!</Link>
              </p>
            </div> */}
          </section>
        </form>
      </section>
    );
  }
}

export default RegisterForm;