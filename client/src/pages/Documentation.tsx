import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Search, BookOpen, Plus, Edit, Trash2, MessageSquare, Star, 
  Eye, Clock, Users, TrendingUp, Lightbulb, CheckCircle,
  FileText, Filter, Calendar, User
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Document, DocumentCategory, AiDocumentImprovement, DocumentFeedback } from "@shared/schema";

// Form schemas
const documentCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().default("#3B82F6"),
  icon: z.string().default("Book"),
  parentId: z.number().optional(),
  sortOrder: z.number().default(0),
});

const documentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  categoryId: z.number().min(1, "Category is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "published", "archived"]).default("published"),
  authorId: z.number().default(1),
  isFeatured: z.boolean().default(false),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  estimatedReadTime: z.number().default(5),
});

const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  userId: z.number().default(1),
  isHelpful: z.boolean().default(true),
});

interface DocumentationProps {
  brand: string;
}

export default function Documentation({ brand }: DocumentationProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCreateDocument, setShowCreateDocument] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const queryClient = useQueryClient();

  // Fetch data
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/documentation/categories"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/documentation/categories");
      return response.json();
    },
  });

  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/documentation/documents", selectedCategory],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/documentation/documents?categoryId=${selectedCategory || ""}`);
      return response.json();
    },
  });

  const { data: featuredDocs = [] } = useQuery({
    queryKey: ["/api/documentation/documents", "featured"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/documentation/documents?featured=true");
      return response.json();
    },
  });

  const { data: aiImprovements = [] } = useQuery({
    queryKey: ["/api/documentation/ai-improvements"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/documentation/documents/1/ai-improvements");
      return response.json();
    },
    enabled: !!selectedDocument,
  });

  // Search documents
  const { data: searchResults = [] } = useQuery({
    queryKey: ["/api/documentation/search", searchQuery, selectedCategory],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/documentation/documents/search?q=${searchQuery}&categoryId=${selectedCategory || ""}`);
      return response.json();
    },
    enabled: searchQuery.length > 2,
  });

  // Mutations
  const createCategoryMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/documentation/categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documentation/categories"] });
      setShowCreateCategory(false);
    },
  });

  const createDocumentMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/documentation/documents", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documentation/documents"] });
      setShowCreateDocument(false);
    },
  });

  const createFeedbackMutation = useMutation({
    mutationFn: ({ documentId, feedback }: { documentId: number; feedback: any }) =>
      apiRequest("POST", `/api/documentation/documents/${documentId}/feedback`, feedback),
    onSuccess: () => {
      setShowFeedbackDialog(false);
    },
  });

  const generateAiImprovementMutation = useMutation({
    mutationFn: ({ documentId, improvementType }: { documentId: number; improvementType: string }) =>
      apiRequest("POST", `/api/documentation/documents/${documentId}/ai-improvements`, { userId: 1, improvementType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documentation/ai-improvements"] });
    },
  });

  // Forms
  const categoryForm = useForm({
    resolver: zodResolver(documentCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#3B82F6",
      icon: "Book",
      sortOrder: 0,
    },
  });

  const documentForm = useForm({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: 0,
      slug: "",
      excerpt: "",
      tags: [],
      status: "published" as const,
      authorId: 1,
      isFeatured: false,
      difficulty: "beginner" as const,
      estimatedReadTime: 5,
    },
  });

  const feedbackForm = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 5,
      comment: "",
      userId: 1,
      isHelpful: true,
    },
  });

  const onCreateCategory = (data: any) => {
    createCategoryMutation.mutate(data);
  };

  const onCreateDocument = (data: any) => {
    // Generate slug from title if not provided
    if (!data.slug) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    createDocumentMutation.mutate(data);
  };

  const onSubmitFeedback = (data: any) => {
    if (selectedDocument) {
      createFeedbackMutation.mutate({ documentId: selectedDocument.id, feedback: data });
    }
  };

  const handleGenerateAiImprovement = (improvementType: string) => {
    if (selectedDocument) {
      generateAiImprovementMutation.mutate({ 
        documentId: selectedDocument.id, 
        improvementType 
      });
    }
  };

  const documentsToShow = searchQuery.length > 2 ? searchResults : documents;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Enterprise documentation and AI-powered knowledge management
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showCreateCategory} onOpenChange={setShowCreateCategory}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Category</DialogTitle>
              </DialogHeader>
              <Form {...categoryForm}>
                <form onSubmit={categoryForm.handleSubmit(onCreateCategory)} className="space-y-4">
                  <FormField
                    control={categoryForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={categoryForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={createCategoryMutation.isPending}>
                    {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateDocument} onOpenChange={setShowCreateDocument}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create Document</DialogTitle>
              </DialogHeader>
              <Form {...documentForm}>
                <form onSubmit={documentForm.handleSubmit(onCreateDocument)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={documentForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={documentForm.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category: DocumentCategory) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={documentForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={8} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={documentForm.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={documentForm.control}
                      name="estimatedReadTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Read Time (min)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={documentForm.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <input 
                              type="checkbox" 
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4"
                            />
                          </FormControl>
                          <FormLabel>Featured</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" disabled={createDocumentMutation.isPending}>
                    {createDocumentMutation.isPending ? "Creating..." : "Create Document"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList>
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select onValueChange={(value) => setSelectedCategory(value === "all" ? null : parseInt(value))}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category: DocumentCategory) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === null ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(null)}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      All Documents
                    </Button>
                    {categories.map((category: DocumentCategory) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Documents List */}
            <div className="lg:col-span-3">
              {documentsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-full mb-2"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documentsToShow.map((doc: Document) => (
                    <Card key={doc.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6" onClick={() => setSelectedDocument(doc)}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg line-clamp-2">{doc.title}</h3>
                          {doc.isFeatured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                          )}
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {doc.excerpt || doc.content.substring(0, 150) + "..."}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {doc.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {doc.estimatedReadTime}min
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Eye className="w-3 h-3 mr-1" />
                            {doc.viewCount || 0}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDocs.map((doc: Document) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <Badge variant="secondary">Featured</Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{doc.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {doc.excerpt || doc.content.substring(0, 150) + "..."}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{doc.difficulty}</Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Eye className="w-3 h-3 mr-1" />
                      {doc.viewCount || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  AI Content Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleGenerateAiImprovement("readability")}
                      disabled={!selectedDocument || generateAiImprovementMutation.isPending}
                    >
                      Improve Readability
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleGenerateAiImprovement("accuracy")}
                      disabled={!selectedDocument || generateAiImprovementMutation.isPending}
                    >
                      Check Accuracy
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleGenerateAiImprovement("completeness")}
                      disabled={!selectedDocument || generateAiImprovementMutation.isPending}
                    >
                      Add Missing Info
                    </Button>
                  </div>
                  
                  {!selectedDocument && (
                    <p className="text-muted-foreground text-sm">
                      Select a document to generate AI improvements
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    {aiImprovements.map((improvement: AiDocumentImprovement) => (
                      <div key={improvement.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary">{improvement.improvementType}</Badge>
                          <Badge 
                            variant={improvement.status === 'approved' ? 'default' : 
                                   improvement.status === 'rejected' ? 'destructive' : 'secondary'}
                          >
                            {improvement.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {improvement.improvementReason}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          Confidence: {Math.round(improvement.confidenceScore * 100)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Content Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{documents.length}</div>
                      <div className="text-sm text-muted-foreground">Total Documents</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{categories.length}</div>
                      <div className="text-sm text-muted-foreground">Categories</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">
                      {documents.reduce((sum: number, doc: Document) => sum + (doc.viewCount || 0), 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Views</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Performing Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents
                    .sort((a: Document, b: Document) => (b.viewCount || 0) - (a.viewCount || 0))
                    .slice(0, 5)
                    .map((doc: Document) => (
                      <div key={doc.id} className="flex justify-between items-center">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.difficulty} • {doc.estimatedReadTime}min
                          </p>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Eye className="w-3 h-3 mr-1" />
                          {doc.viewCount || 0}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Published</span>
                    <Badge variant="default">
                      {documents.filter((doc: Document) => doc.status === 'published').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Draft</span>
                    <Badge variant="secondary">
                      {documents.filter((doc: Document) => doc.status === 'draft').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Featured</span>
                    <Badge variant="outline">
                      {documents.filter((doc: Document) => doc.isFeatured).length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    No recent activity data available
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Document Viewer Dialog */}
      {selectedDocument && (
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedDocument.title}</span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowFeedbackDialog(true)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Feedback
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge variant="secondary">{selectedDocument.difficulty}</Badge>
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {selectedDocument.estimatedReadTime} min read
                </Badge>
                <Badge variant="outline">
                  <Eye className="w-3 h-3 mr-1" />
                  {selectedDocument.viewCount || 0} views
                </Badge>
              </div>
              
              <Separator />
              
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap">{selectedDocument.content}</div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Feedback</DialogTitle>
          </DialogHeader>
          <Form {...feedbackForm}>
            <form onSubmit={feedbackForm.handleSubmit(onSubmitFeedback)} className="space-y-4">
              <FormField
                control={feedbackForm.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (1-5)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="5" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={feedbackForm.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment (optional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={createFeedbackMutation.isPending}>
                {createFeedbackMutation.isPending ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}