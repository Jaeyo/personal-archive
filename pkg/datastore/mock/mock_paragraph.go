// Code generated by MockGen. DO NOT EDIT.
// Source: paragraph.go

// Package mock is a generated GoMock package.
package mock

import (
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
	models "github.com/jaeyo/personal-archive/models"
)

// MockParagraphDatastore is a mock of ParagraphDatastore interface.
type MockParagraphDatastore struct {
	ctrl     *gomock.Controller
	recorder *MockParagraphDatastoreMockRecorder
}

// MockParagraphDatastoreMockRecorder is the mock recorder for MockParagraphDatastore.
type MockParagraphDatastoreMockRecorder struct {
	mock *MockParagraphDatastore
}

// NewMockParagraphDatastore creates a new mock instance.
func NewMockParagraphDatastore(ctrl *gomock.Controller) *MockParagraphDatastore {
	mock := &MockParagraphDatastore{ctrl: ctrl}
	mock.recorder = &MockParagraphDatastoreMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockParagraphDatastore) EXPECT() *MockParagraphDatastoreMockRecorder {
	return m.recorder
}

// DeleteParagraphByIDAndNoteID mocks base method.
func (m *MockParagraphDatastore) DeleteParagraphByIDAndNoteID(id, noteID int64) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteParagraphByIDAndNoteID", id, noteID)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteParagraphByIDAndNoteID indicates an expected call of DeleteParagraphByIDAndNoteID.
func (mr *MockParagraphDatastoreMockRecorder) DeleteParagraphByIDAndNoteID(id, noteID interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteParagraphByIDAndNoteID", reflect.TypeOf((*MockParagraphDatastore)(nil).DeleteParagraphByIDAndNoteID), id, noteID)
}

// DeleteParagraphByIDs mocks base method.
func (m *MockParagraphDatastore) DeleteParagraphByIDs(ids []int64) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteParagraphByIDs", ids)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteParagraphByIDs indicates an expected call of DeleteParagraphByIDs.
func (mr *MockParagraphDatastoreMockRecorder) DeleteParagraphByIDs(ids interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteParagraphByIDs", reflect.TypeOf((*MockParagraphDatastore)(nil).DeleteParagraphByIDs), ids)
}

// FindParagraphByIDsAndNoteID mocks base method.
func (m *MockParagraphDatastore) FindParagraphByIDsAndNoteID(ids []int64, noteID int64) (models.Paragraphs, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "FindParagraphByIDsAndNoteID", ids, noteID)
	ret0, _ := ret[0].(models.Paragraphs)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// FindParagraphByIDsAndNoteID indicates an expected call of FindParagraphByIDsAndNoteID.
func (mr *MockParagraphDatastoreMockRecorder) FindParagraphByIDsAndNoteID(ids, noteID interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "FindParagraphByIDsAndNoteID", reflect.TypeOf((*MockParagraphDatastore)(nil).FindParagraphByIDsAndNoteID), ids, noteID)
}

// GetParagraphByIDAndNoteID mocks base method.
func (m *MockParagraphDatastore) GetParagraphByIDAndNoteID(id, noteID int64) (*models.Paragraph, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetParagraphByIDAndNoteID", id, noteID)
	ret0, _ := ret[0].(*models.Paragraph)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetParagraphByIDAndNoteID indicates an expected call of GetParagraphByIDAndNoteID.
func (mr *MockParagraphDatastoreMockRecorder) GetParagraphByIDAndNoteID(id, noteID interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetParagraphByIDAndNoteID", reflect.TypeOf((*MockParagraphDatastore)(nil).GetParagraphByIDAndNoteID), id, noteID)
}

// SaveParagraph mocks base method.
func (m *MockParagraphDatastore) SaveParagraph(paragraph *models.Paragraph) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "SaveParagraph", paragraph)
	ret0, _ := ret[0].(error)
	return ret0
}

// SaveParagraph indicates an expected call of SaveParagraph.
func (mr *MockParagraphDatastoreMockRecorder) SaveParagraph(paragraph interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "SaveParagraph", reflect.TypeOf((*MockParagraphDatastore)(nil).SaveParagraph), paragraph)
}
