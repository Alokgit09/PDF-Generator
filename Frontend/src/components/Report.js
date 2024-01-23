import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Document, Page } from 'react-pdf';

const Report = () => {
    const [pdfData, setPdfData] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUserData = async () => {
            // let id = JSON.parse(localStorage.getItem('User')).registerID;
            let id = JSON.parse(localStorage.getItem('UserBtn')).registerID;
            // let userName = JSON.parse(localStorage.getItem('User')).name;
            try {
                const response = await axios.get(`http://localhost:9090/getuserdata/${id}`);
                let data = response.data;
                let pdfPathurl = 'http://localhost:9090' + data;
                setPdfData(pdfPathurl);
            } catch (error) {
                console.error('Error fetching PDF data:', error);
                setError("Please Generate PDF File");
            }
        };

        getUserData();
    }, []);



    const generateDocPdf = async () => {
        let id = JSON.parse(localStorage.getItem('UserBtn')).registerID;

        try {
            const response = await axios.post(`http://localhost:9090/generatpdf/${id}`);
            let data = response.data;
            let pdfPathurl = 'http://localhost:9090' + data;
            setTimeout(() => {
                setPdfData(pdfPathurl);
            }, 1000);
        } catch (error) {
            console.error('Error generating PDF:', error);
            setError('Failed to generate PDF.');
        }


    };

    return (
        <div>
            {
                pdfData ? null : error && <h3 className='erro_msg'> {error}</h3>}
            {/* <iframe src={pdfData} /> */}
            {
                pdfData ? <object width="100%" height="600" data={pdfData} type="application/pdf"></object>
                    : <button className='pdfgenerat_btn' onClick={generateDocPdf} >Generate PDF</button>
            }
        </div>
    );
};

export default Report;

