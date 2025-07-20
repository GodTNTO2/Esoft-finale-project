import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // const uploadDir = path.join(__dirname, '../../fronted/public/uploads/products')
        const uploadDir = path.join('C:/Users/glebd/Desktop/prod/frontend/public/uploads/products')
        console.log(uploadDir)
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        cb(null, `${uuidv4()}${ext}`);
    }
})

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Invalid file type'))
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 
    }
})


export class imageUploadMiddleware {
    constructor(
        private fieldName: string,
        private maxCount: number = 10
    ) {}
        execute (req: Request, res: Response, next: NextFunction) {
            upload.array(this.fieldName, this.maxCount)(req, res, (err) => {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ error: 'File size exceeds 5MB limit' });
                }
                if (err.message.includes('Invalid file type')) {
                    return res.status(400).json({ error: err.message });
                }
                return res.status(500).json({ error: 'File upload failed' });
            }
            next();
        })
    }
}