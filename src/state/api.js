import React, { useContext, useState, useEffect } from 'react';
import { 

/* globals API_URL */
import axios from 'axios';

function selectAPI(state) {
  if (state.currentUser.sharedUser) {
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: state.currentUser.sharedUser.persistentToken,
      },
    });
  }
  return axios.create({
    baseURL: API_URL,
  });
}

