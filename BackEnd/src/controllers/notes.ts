import { RequestHandler } from "express";
import NoteModel from "../models/note";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import { assertIsDefined } from "../util/assertIsDefined";

export const getNotes: RequestHandler = async (req,res, next) => {
    const authenticatedUserId = req.session.userId;
    // res.send("Hello, world");
    try{
        assertIsDefined(authenticatedUserId);
        // throw Error("Error aaraha hy!");
        const notes = await NoteModel.find({userId: authenticatedUserId}).exec();
        res.status(200).json(notes);
    }
    catch(error){
        next(error);
    }
}



export const getNote: RequestHandler = async (req, res, next) =>{
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;
    try{
        assertIsDefined(authenticatedUserId);

        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid Note Id");
        }

        const note = await NoteModel.findById(noteId).exec();

        if(!note || note == null){
            createHttpError(404, "Note not found!");
        }

        if(note == null || !note.userId.equals(authenticatedUserId)){
            throw createHttpError(401, "You cannot access this note!");
        }

        res.status(200).json(note);
    }
    catch(error){
        next(error);
    }
}

interface CreateNoteBody{
    title?: string,
    text?: string
}

export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) =>{
    const title = req.body.title;
    const text = req.body.text;
    const authenticatedUserId = req.session.userId;

    try{
        assertIsDefined(authenticatedUserId);

        if(!title){
            throw createHttpError(400, "Note must have a TITLE");
        }
        const newNote = await NoteModel.create({
            userId: authenticatedUserId,
            title: title,
            text: text
        });
        res.status(201).json(newNote);
    }
    catch(error){
        next(error);
    }
}

interface UpdateNoteParams{
    noteId: string, 
}

interface UpdateNoteBody{
    title?: string,
    text?: string
}

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) =>{
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const authenticatedUserId = req.session.userId;
    try{
        assertIsDefined(authenticatedUserId);

        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid NoteId");
        }
        if(!newTitle){
            throw createHttpError(400, "Must have a Titile");
        }
        const note = await NoteModel.findById(noteId).exec();
        
        if(!note){
            throw createHttpError(404, "Note Not Found Error!");
        }
        if(!note?.userId.equals(authenticatedUserId)){
            throw createHttpError(401, "You cannot access this note!");
        }

        note.title = newTitle;
        note.text = newText;

        const updatedNote = await note.save();

        res.status(200).json(updateNote);

    }
    catch(error){
        next(error)
    }
}


export const deleteNote: RequestHandler = async(req, res, next) =>{
    const authenticatedUserId = req.session.userId;
    try{
        assertIsDefined(authenticatedUserId);

        const noteId = req.params.noteId;
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Note is InValid");
        }
        const note = await NoteModel.findById(noteId).exec();
        if(!note){
            throw createHttpError(404, "Note does not exist! ERROR!");
        }
        if(!note?.userId.equals(authenticatedUserId)){
            throw createHttpError(401, "You cannot access this note!");
        }
        await NoteModel.findByIdAndDelete(noteId);

        res.sendStatus(200);
    }
    catch(error){
        next(error);
    }
}