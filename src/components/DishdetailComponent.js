import React, { Component } from 'react';
import { Card, CardImg, CardImgOverlay, CardText, CardBody,
    CardTitle , Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Form,
    Row, Col, Label } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);
const unselected = (val) => !(val === "Select a Rating");

function RenderDish({dish}) {
    return (
        <div className="col-12 col-md-5 m-1">
            <Card>
                <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} />
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
        </div>
    );
}

function RenderComments ({comments, postComment, dishId}) {

    if (comments!= null) {
        return(
            <div className="col-12 col-md-5 m-1">
                <h4>Comments</h4>
                <ul> 
                    {comments.map((comm) => {
                    return (
                        <li key={comm.id}> 
                        <p>{comm.comment}</p><p>
                        {comm.author} ,  {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comm.date)))}</p>          
                        </li>
                    );
                    })}
                </ul>
                <br />
                <CommentForm dishId ={dishId} postComment={postComment} />
            </div>
            
        );
    }
    else {
        return(
            <div>
                <CommentForm />
            </div>
        );
    }
}

const DishDetail = (props) => {

    if (props.isLoading) {
        return(
            <div className="container">
                <div className="row">            
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.errMess) {
        return(
            <div className="container">
                <div className="row">            
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }
    else if (props.dish != null) {
        return(
            <div className="container">
                <Row>
                    <Breadcrumb>
                        <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <Col xs={12}>
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </Col>  
                </Row>
                <Row>
                    <RenderDish dish ={props.dish} />
                    <RenderComments comments = {props.comments} 
                        postComment = {props.postComment}
                        dishId = {props.dish.id} />
                </Row>
            </div>
        );
    }
    else {
        return (
            <div></div>
        );
    }
}

class CommentForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    onSubmit(values) {
        this.toggleModal();
        alert('you submitted a comment!');
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }

    
    render () {
        return(
        <React.Fragment>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader isOpen={this.state.isModalOpen} toggle={this.toggleModal}>Login</ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit = {this.onSubmit}>
                        <Row className="form-group">
                            <Col xs={12}>
                                <Label htmlFor="rating">Rating</Label>
                            </Col>
                            <Col xs={12}>
                                <Control.select model=".rating" id="rating" name="rating" 
                                    className="form-control"
                                    validators={{
                                        unselected
                                    }}>
                                    <option>Select a Rating</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Control.select>
                                <Errors
                                    className="text-danger"
                                    model=".rating"
                                    show="touched"
                                    messages={{
                                        unselected: 'Please choose a rating'
                                    }} />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col xs={12}>
                                <Label htmlFor="author">Your Name</Label>
                            </Col>
                            <Col xs={12}>
                                <Control.text model=".author" id="author" name="author"
                                    placeholder="Author"
                                    className="form-control"  
                                    validators={{
                                        required,  minLength: minLength(3), maxLength: maxLength(15)
                                    }} />
                                <Errors
                                    className="text-danger"
                                    model=".author"
                                    show="touched"
                                    messages={{
                                        required: 'Required ',
                                        minLength: 'Must be greater than 2 characters',
                                        maxLength: 'Must be 15 characters or less'
                                    }} />

                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col xs={12}>
                                <Label htmlFor="comment">Your Comment</Label>
                            </Col>
                            <Col xs={12}>
                                <Control.textarea model=".comment" id="comment" name="comment"
                                    rows="6"
                                    className="form-control" 
                                    validators={{
                                        required
                                    }}/>
                                <Errors
                                    className="text-danger"
                                    model=".comment"
                                    show="touched"
                                    messages={{
                                        required: 'Required ',
                                    }} />
                            </Col>
                        </Row >
                        <Row>
                            <Col>
                                <Button color="primary">Submit</Button>
                            </Col>
                        </Row>
                    </LocalForm>
                </ModalBody>
            </Modal>
            <Button onClick={this.toggleModal} type="submit" value="submit" outline color="secondary">
                <i className="fa fa-pencil" /> {' '} Submit Comment 
            </Button>
        </React.Fragment>
        );
    }
}
export default DishDetail;

